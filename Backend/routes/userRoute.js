import express  from 'express'
import { registerUser,loginUser, getProfile, updateProfile,bookAppointment, listAppointement, cancelAppointment,paymentRazorpay,verifyRazorpay } from '../Controllers/userControllers.js'
import Authuser from '../Middlewares/Authuser.js'
import upload from '../Middlewares/multer.js'
const userRouter = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',Authuser,getProfile)
userRouter.post('/update-profile',upload.single('image'),Authuser,updateProfile)
userRouter.post('/book-appointement',upload.single('image'),Authuser,bookAppointment)
userRouter.get('/appointments',Authuser,listAppointement)
userRouter.post('/cancel-appointment',Authuser,cancelAppointment)
userRouter.post('/payment-razorpay',Authuser,paymentRazorpay)
userRouter.post('/verifyRazorpay',Authuser,verifyRazorpay)
export default userRouter;