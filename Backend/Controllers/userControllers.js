import validator from 'validator';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import appointmentModel from "../Models/appointementModel.js";
import userModel from '../Models/userModel.js';
import doctorModel from "../Models/DoctorModel.js";
import { v2 as cloudinary } from 'cloudinary';
import razorpay from 'razorpay'
// ===============================
// ✅ Register User
// ===============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password (min 8 characters)" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };
    const newuser = new userModel(userData);
    const user = await newuser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ Login User
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ Get Profile
// ===============================
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===============================
// ✅ Update Profile
// ===============================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address),
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      await userModel.findByIdAndUpdate(userId, {
        image: imageUpload.secure_url
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ===============================
// ✅ Book Appointment
// ===============================
const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    // ✅ Check required fields
    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing appointment details (doctor, date, or time)" });
    }

    // ✅ Get doctor data
    const docDataDoc = await doctorModel.findById(docId).select("-password");
    if (!docDataDoc || !docDataDoc.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    // ✅ Update doctor slot bookings
    let slots_booked = docDataDoc.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // ✅ Get user data
    const userDataDoc = await userModel.findById(userId).select("-password");
    if (!userDataDoc) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ Convert documents to plain objects
    const userData = userDataDoc.toObject();
    const docData = docDataDoc.toObject();
    delete docData.slots_booked; // optional: don’t store slot history in appointment

    // ✅ Create and save appointment
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });

  } catch (error) {
    console.error("Book Appointment Error:", error);
    res.json({ success: false, message: error.message });
  }
};


// ===============================
// ✅ List Appointments
// ===============================
const listAppointement = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api to cancle appointement
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;

    // Validate input
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Missing appointment ID" });
    }

    // Fetch appointment
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check if user owns this appointment
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    // Mark as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release slot from doctor's schedule
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = doctorData.slots_booked || {};

    // If slotDate exists, update it
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

      // Optional: delete the date key if no slots left
      if (slots_booked[slotDate].length === 0) {
        delete slots_booked[slotDate];
      }

      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    return res.json({ success: true, message: "Appointment cancelled successfully" });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to make payment for appointment using Razorpay
 const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Fetch appointment from DB
    const appointmentData = await appointmentModel.findById(appointmentId);

    // If appointment not found or cancelled
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found" });
    }

    // Razorpay payment options
    const options = {
      amount: appointmentData.amount * 100, // amount in paise (₹1 = 100 paise)
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Create order with Razorpay
    const order = await razorpayInstance.orders.create(options);

    // Respond with order info
    res.json({ success: true, order });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Payment failed", error: error.message });
  }
};

//api to verfy the 
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    // Fetch full order info from Razorpay using order_id
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // Check if order is paid
    if (orderInfo.status === 'paid') {
      // Update appointment in DB
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointement,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay
};
