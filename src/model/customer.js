import mongoose from "mongoose"
import bcrypt from "bcryptjs"
const customer = new mongoose.Schema({
   username:{
      type:String,
      required:[true, "Please provide a username "],
      unique:true  
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    number: {
      type: String,
      required: [true, "please enter your number"],
      unique: true
    },
    role: {
      type: String,
      enum: ["customer", "barber", "admin", "superadmin"],
      default: "customer"
   },province: {
      type: String,
   },city: {
      type: String,
   },location: {
      type: String,
   },followers: {
      type: Number,
      default: 0
   },following: {
      type: Number,
      default: 0
   },
   restricted: {
  type: Boolean,
  default: false
}

},
{timestamps:true}
)

customer.pre("save", async function (next){
   if(!this.isModified("password")) return next()
      try{
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next()
      }catch(err){
         return next(err)
      }
})
customer.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export default mongoose.models.customer || mongoose.model("customer", customer);