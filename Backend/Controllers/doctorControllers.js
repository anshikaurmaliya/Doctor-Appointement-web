import DoctorModel from "../Models/DoctorModel.js";

// ✅ Change Availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await DoctorModel.findById(docId);
    await DoctorModel.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: 'Availability Changed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Doctors (excluding password & email)
const doctorList = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Doctor by ID (used in /api/doctor/:id)
const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id).select(['-password', '-email']);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { changeAvailability, doctorList, getDoctorById };
