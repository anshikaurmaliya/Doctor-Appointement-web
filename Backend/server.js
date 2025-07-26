import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './Config/mongodb.js';
import connectCloudinary from './Config/cloudinary.js';
import adminRouter from './routes/adminroute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

//middlewares

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));  // ✅ ADD THIS

// Api endpoint 

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
    res.send('API Working gre')
})

app.listen(port,()=> console.log("Server Started",port))