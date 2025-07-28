import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },     // e.g. "2025-08-01"
  slotTime: { type: String, required: true },     // e.g. "03:00 PM"
  userData: { type: Object, required: true },     // full user snapshot at booking time
  docData: { type: Object, required: true },      // full doctor snapshot at booking time
  amount: { type: Number, required: true },       // consultation fee
  date: { type: Number, required: true },         // Date.now() at booking
  cancelled: { type: Boolean, default: false },   // true if user/doctor cancelled
  payment: { type: Boolean, default: false },     // true if payment was successful
  isCompleted: { type: Boolean, default: false }, // true when appointment is over
});

const appointmentModel =
  mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
