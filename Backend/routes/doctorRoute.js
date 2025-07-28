import express from "express";
import { doctorList, getDoctorById } from "../Controllers/doctorControllers.js";

const doctorRouter = express.Router();

// GET all doctors
doctorRouter.get('/list', doctorList);

// ✅ NEW: GET single doctor by ID
doctorRouter.get('/:id', getDoctorById);

export default doctorRouter;
