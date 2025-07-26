import express from "express";
import { doctorList } from "../Controllers/doctorControllers.js";
const  doctorRouter = express.Router()
doctorRouter.get('/list',doctorList)


export default doctorRouter