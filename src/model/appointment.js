import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "barber",
    required: true,
  },
  services: {
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: [true, "Please provide at least one service with price"],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },

  // --- Extra Barber Snapshot Info ---
  barber: {
    username: { type: String },
    email: { type: String },
    number: { type: String },
    city: { type: String },
    province: { type: String },
    location: { type: String },
    rating: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    reviews: [
      {
        customer: { type: String },
        comment: { type: String },
        stars: { type: Number },
      },
    ],
    workinghours: [
      {
        day: { type: String },
        start: { type: String },
        end: { type: String },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true }
);

export default mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

// import mongoose from "mongoose";

// const appointmentSchema = new mongoose.Schema({
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "customer", // reference to your Customer model
//     required: true,
//   },
//   barberId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "barber", // reference to your Barber model
//     required: true,
//   },
//   services: {
//     type: [
//       {
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//     required: [true, "Please provide at least one service with price"],
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   time: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled"],
//     default: "pending",
//   },
// });

// export default mongoose.models.appointment ||
//   mongoose.model("appointment", appointmentSchema);
