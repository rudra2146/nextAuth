import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Please provide a username"]
    },
    email: {
        type: String,
        required: [false,"Please provide a email"],
        unique: true
    },
    password: { type: String, required: false }, // 👈 Optional for Google users
    hasPassword: { type: Boolean, default: false }, // 👈 New field    
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    forgotPasswordToken : String,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry: Date
})


const User = mongoose.models["users"] || mongoose.model("users", userSchema);

export default User