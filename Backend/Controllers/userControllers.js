//Api to regester user
import validator from 'validator'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel.js'
import {v2 as cloudinary } from 'cloudinary';

const registerUser = async (req, res)=>{
    try {
        const {name,email,password} = req.body
        if(!name || !password || !email)
        {
            return res.json({sucess:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
                      return res.json({sucess:false,message:"enter a valid email"})
  
        }
        if(password.length<8){
                        return res.json({sucess:false,message:"enter a strong  password"})

        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newuser = new userModel(userData)
        const  user = await newuser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})
    } catch (error) {
       console.log(error) 
       res.json({success:false,message:error.message})
    }
}

//A pi for user login

const loginUser = async (req,res)=>{
    try{
         const {email,password} = req.body
         const user = await userModel.findOne({email})
         if(!user){
               return res.json({success:false,message:'User does not exist'})

         }

         const isMatch = await bcrypt.compare(password,user.password)
         if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json ({success:true,token})
         }else{
            res.json({success:false,message:"Invalid credentials"})
         }
    }catch(error){
    res.json({success:false,message:error.message})

    }
}

//Api to get user profile data

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From Authuser middleware

    const user = await userModel.findById(userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// API to update user Profile


// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validation
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Update basic details
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      dob,
      gender,
      address: JSON.parse(address) // Frontend sends address as JSON string
    });

    // Upload image if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, {
        image: imageURL
      });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {registerUser,loginUser,getProfile,updateProfile}