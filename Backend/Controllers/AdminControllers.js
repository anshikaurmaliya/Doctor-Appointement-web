import bcrypt from 'bcrypt';
import validator from 'validator';
import {v2 as cloudinary} from 'cloudinary'; // adjust path if needed
import DoctorModel from '../Models/DoctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../Models/appointementModel.js';
import userModel from '../Models/userModel.js';
//api for adding doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    console.log("Incoming doctor data:", req.body);
    console.log("Image file received:", req.file);

    if (
      name === undefined || email === undefined || password === undefined ||
      speciality === undefined || degree === undefined ||
      experience === undefined || about === undefined ||
      fees === undefined || address === undefined || !imageFile
    ) {
      return res.status(400).json({ message: "All fields including image are required" });
    }

    // Basic Validations
    if (!validator.isLength(name, { min: 2 })) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const experienceNum = Number(experience);
    const feesNum = Number(fees);

    if (isNaN(experienceNum) || experienceNum < 0) {
      return res.status(400).json({ message: "Experience must be a valid number" });
    }

    if (isNaN(feesNum) || feesNum < 0) {
      return res.status(400).json({ message: "Fees must be a valid number" });
    }

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

    // Check if doctor already exists
    const existingDoctor = await DoctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: "Doctor with this email already exists" });
    }

    // Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience: experienceNum,
      about,
      fees: feesNum,
      address: parsedAddress,
      image: imageUpload.secure_url,
      date: Date.now(),
      slots_booked: [] // explicitly define to avoid mongoose default error
    };

    const newDoctor = new DoctorModel(doctorData);
    await newDoctor.save();

    res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
//api for the admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check with .env values
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Sign structured payload
      const payload = {
        role: 'admin',
        email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//API to get all  doctorlist for admin panel
const allDoctors = async (req,res)=>{
  try {
    const doctors = await DoctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//Api i to get all appointment list

const appointmentAdmin = async (req,res)=>{
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
} 

const Appointmentcancel = async (req, res) => {
  try {
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
   

    // Mark as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Release slot from doctor's schedule
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await DoctorModel.findById(docId);
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

      await DoctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    return res.json({ success: true, message: "Appointment cancelled successfully" });

  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//Api to get dashBoard Data for Admin
const adminDashboard = async (req,res)=>{
  try {
    const doctors = await DoctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      appointments:appointments.length,
      patiens :users.length,
      latestAppointment:appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
export { addDoctor,loginAdmin,allDoctors,appointmentAdmin,Appointmentcancel,adminDashboard };
