import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to your User model
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const barberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    number: {
      type: String,
      required: [true, "Please enter your number"],
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Please enter your location"],
    },
    province: {
      type: String,
      required: [true, "Please select a province"],
    },
    city: {
      type: String,
      required: [true, "Please select a city"],
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema], 
    about:{
      type: String,
      required: [false, "Please enter your about"],
    },
    
    image: {
        fileId: { type: String,  },
        url: { type: String, },
      alt: { type: String },
      },

    portfolio: [
      {
        fileId: { type: String,  },
        url: { type: String, },
        alt: { type: String },
      },
    ],
    services: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      ],
      required: [true, "Please provide at least one service with price"],
    },
    workinghours: {
      type: [
        {
          day: { type: String, required: true },
          start: { type: String, required: true },
          end: { type: String, required: true },
        },
      ],
      required: [true, "Please enter your working hours"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    role: {
      type: String,
      enum: ["customer", "barber", "admin", "superadmin"],
      default: "barber",
    },
  },
  { timestamps: true }
);

// Password hashing before save
barberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare password method
barberSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

export default mongoose.models.barber ||
  mongoose.model("barber", barberSchema);

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// const barberSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "Please provide a username "],
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please provide a email"],
//       unique: true,
//       match: [
//         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//         "Please provide a valid email address",
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, "please enter your password"],
//       minlength: [6, "Password must be at least 6 characters long"]
//     },
//     number: {
//       type: String,
//       unique: true,
//       required: [true, "please enter your number"],
//     },
//     location: {
//       type: String,
//       required: [true, "please enter your location"],
//     },
//     services: {
//       type: [
//         {
//           name: { type: String, required: true },
//           price: { type: Number, required: true },
//         },
//       ],
//       required: [true, "Please provide at least one service with price"],
//     },
//     workinghours: {
//       type: [
//         {
//           day: { type: String, required: true }, // e.g. "Monday"
//           start: { type: String, required: true }, // e.g. "09:00 AM"
//           end: { type: String, required: true }, // e.g. "06:00 PM"
//         },
//       ],
//       required: [true, "Please enter your working hours"],
//     },

//     role: {
//       type: String,
//       enum: ["customer", "barber", "admin", "superadmin"],
//       default: "barber",
//     },
//   },
//   { timestamps: true }
// );

// barberSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     return next(err);
//   }
// });
// barberSchema.methods.comparePassword = async function (candidatePassword) {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     return false;
//   }
// };

// export default mongoose.models.barber ||
//   mongoose.model("barber", barberSchema);
