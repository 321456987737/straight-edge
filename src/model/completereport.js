import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    username: { type: String }, // optional
    email: { type: String }, // optional
    report: { type: String, required: true }, // required
    customerId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.completereport ||
  mongoose.model("completereport", ReportSchema);
