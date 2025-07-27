import express  from 'express'
import { registerUser,loginUser, getProfile, updateProfile } from '../Controllers/userControllers.js'
import Authuser from '../Middlewares/Authuser.js'
import upload from '../Middlewares/multer.js'
const userRouter = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',Authuser,getProfile)
userRouter.post('/update-profile',upload.single('image'),Authuser,updateProfile)

export default userRouter;