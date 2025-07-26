//Api to regester user
import validator from 'validator'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel.js'
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
        res.json({sucess:true,token})
    } catch (error) {
       console.log(error) 
       res.json({sucess:false,message:error.message})
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
            res.json({sucess:false,message:"Invalid credentials"})
         }
    }catch(error){
    res.json({success:false,message:error.message})

    }
}

export {registerUser,loginUser}