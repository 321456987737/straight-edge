import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
   barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "barber", // reference to your Barber model
      required: true,
   },
   customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer", // reference to your Customer model
      required: true,
   },
   reports: {
      type: String,
      trim: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

export default mongoose.models.report ||
   mongoose.model("report", reportSchema);