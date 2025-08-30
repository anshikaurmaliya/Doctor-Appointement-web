import DoctorModel from "../Models/DoctorModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import appointmentModel from "../Models/appointementModel.js"
const changeAvailability = async (req,res)=>{
   try{
          const {docId} = req.body
          const docData = await DoctorModel.findById(docId)
          await DoctorModel.findByIdAndUpdate(docId,{available: !docData.available})
          res.json({success:true,message:'Availablity Changed'})
   } catch (error)
   {
     console.log(error)
    res.json({success:false,message:error.message})
   }
}

const doctorList = async (req,res)=>{
    try{
          const doctors = await DoctorModel.find({}).select(['-password','-email'])
     res.json({success:true,doctors})
    }catch(error)
    {
       console.log(error)
    res.json({success:false,message:error.message})
    }
}

//Api for doctor Login 
const loginDoctor = async (req,res)=>{
   try {
      const {email,password} = req.body
      const doctor = await DoctorModel.findOne({email})
      if(!doctor){
         return res.json({sucess:false,message:'Invalid Credintials'})
      }

      const isMatch =  await bcrypt.compare(password,doctor.password)
          
      if(isMatch){
         const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
         res.json({success:true,token})
      }else{
         res.json({success:false,message:'Invalid credentials'})
      }
   } catch (error) {
       console.log(error)
    res.json({success:false,message:error.message})
    }
   
}


//Api to get doctor appointment for doctor pannel

const appointmentsDoctor = async (req,res)=>{
   try {
    const docId = req.doctor.id; // get from middleware
      const appointments = await appointmentModel.find({docId})

      res.json({success:true,appointments})
   } catch (error) {
      console.log(error)
    res.json({success:false,message:error.message})
   }
}

//Api to mark appointment completed for doctor panel
const appointmentComplete = async (req,res)=>{
   try{
      const docId = req.doctorId; // ✅ correct via auth middleware

    const {appointmentId} = req.body
    const appointmentData = appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({success:true,message:'Appointment Completed'})
    }else{
      return res.json({success:false,message:'Mark as Failed'})
    }
   }catch(error){
console.log(error)
res.json({success:false,message:error.message})
   }
}
// API to cancel appointment for doctor panel
const appointmentCancel = async (req,res)=>{
   try{
      const docId = req.doctorId; // ✅ correct via auth middleware

    const {appointmentId} = req.body
    const appointmentData = appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId === docId){
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({success:true,message:'Appointment Cancelled'})
    }else{
      return res.json({success:false,message:'Cancel Failed'})
    }
   }catch(error){
console.log(error)
res.json({success:false,message:error.message})
   }
}

//Api to get Dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
     const docId = req.doctor.id
    console.log("Current Doctor ID:", docId);

    const appointments = await appointmentModel.find({ docId });
    console.log("Appointments for dashboard:", appointments);

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
   })
     let patients = []
      appointments.map((item)=>{
         if(!patients.includes(item.userId)){
            patients.push(item.userId)
         }
      })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get Doctor profile for dOctor panel

const doctorProfile = async (req,res)=>{ 
   try {
     const docId = req.doctor.id
     const profileData = await DoctorModel.findById(docId).select('-password')
     res.json({success:true,profileData})
   } catch (error) {
       console.log(error);
    res.json({ success: false, message: error.message });
   }
}
//Api to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req,res)=>{
   try{
           const docId = req.doctor.id
      const {fees,address,available} = req.body
       await DoctorModel.findByIdAndUpdate(docId,{fees,address,available})
       res.json({sucess:true,message:'Profile Updated'})
   }catch (error) {
       console.log(error);
    res.json({ success: false, message: error.message });
   }
}
export {changeAvailability,
   doctorList,loginDoctor,
   appointmentsDoctor,
   appointmentCancel,
   appointmentComplete,
   doctorDashboard,
   doctorProfile,
   updateDoctorProfile}