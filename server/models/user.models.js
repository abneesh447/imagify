import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    creditBalance: {
        type: Number,
        default: 5
    }
}, {timestamps: true})



export const User = mongoose.model("User", userSchema)