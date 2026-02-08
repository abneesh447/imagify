import mongoose, {Schema} from "mongoose";

const transactionSchema = new Schema({
    userId : {
        type: String,
        required: true
    },
    plan : {
        type : String,
        required : true
    },
    amount: {
        type : Number,
        required : true
    },
    credits: {
        type : Number,
        required : true
    },
    payment: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        required: true,
    }
}, {timestamps: true})



export const Transaction = mongoose.model("Transaction", transactionSchema)