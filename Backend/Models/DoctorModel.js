import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL to the image
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: Number, // years of experience
        required: true
    },
    about: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default:true
    },
    fees: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    slots_booked: [
        {
            required: Object,
            default:{}
        }
    ]
},{ minimize: false });

const DoctorModel = mongoose.models.doctor || mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
