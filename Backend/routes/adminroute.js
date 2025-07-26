import express from 'express'

import { addDoctor,allDoctors,loginAdmin } from '../Controllers/AdminControllers.js'
import upload from '../Middlewares/multer.js'
import authAdmin from '../Middlewares/Authadmin.js'
import { changeAvailability } from '../Controllers/doctorControllers.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', upload.single('image'), authAdmin, addDoctor);
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)

export default adminRouter;