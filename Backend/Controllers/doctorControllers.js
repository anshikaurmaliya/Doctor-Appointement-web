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

export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor}