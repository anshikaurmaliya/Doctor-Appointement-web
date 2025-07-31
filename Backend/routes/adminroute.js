import express from 'express'

import { addDoctor,allDoctors,loginAdmin,appointmentAdmin,Appointmentcancel,adminDashboard } from '../Controllers/AdminControllers.js'
import upload from '../Middlewares/multer.js'
import authAdmin from '../Middlewares/Authadmin.js'
import { changeAvailability } from '../Controllers/doctorControllers.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', upload.single('image'), authAdmin, addDoctor);
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentAdmin)
adminRouter.post('/cancel-appointment',authAdmin,Appointmentcancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)

export default adminRouter;