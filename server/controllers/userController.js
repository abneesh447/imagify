import { User } from "../models/user.models.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import Razorpay from "razorpay"
import { Transaction } from "../models/transaction.models.js";




const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
    
        if(!name || !email || !password){
            return res.json({success:false, message: 'Missing details'})
        }
    
        const existedUser = await User.findOne({email})
    
        if(existedUser){
            return res.json({success:false, message: 'User already exists'})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
    
        const userData = {
            name,
            email,
            password: hashedPassword
        }
    
        const newUser = new User(userData)
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    
        return res.json({
            success: true,
            token,
            user: {
                name: user.name
            }
        })
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.json({
                success: false,
                message: 'Email and password required'
            })
        }

        const user = await User.findOne({email})
    
        if(!user){
            return res.json({
                success: false,
                message: 'User not exist'
            })
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if(!isPasswordValid){
            return res.json({
                success: false,
                message: 'Invalid Password !'
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        
        return res.json({
            success: true,
            token,
            user: { 
                name: user.name 
            }
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

const userCredit = async(req,res)=>{
    try {
        
        const userId = req.userId
        
        if(!userId){
            return res.json({
                success:false,
                message: 'userId not found'
            })
        }

    
        const user = await User.findById(userId)
    
        if(!user){
            return res.json({
                success:false,
                message: 'user not found'
            })
        }
        res.json({
            success: true,
            credits: user.creditBalance,
            user: {
                name: user.name
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }

}


const paymentRazorpay = async (req,res)=>{
    try {

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const userId = req.userId
        const {planId} = req.body

        const userData =await User.findById(userId)

        if(!userId || !planId){
            return res.json({success: false ,message : 'missing details'})
        }

        let credits,plan ,amount, date

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
        
            default:
                return res.json({ success:false ,message: "plan not found"});
        }
        date = Date.now();

        const transactionData = {
            userId, plan, amount, credits, date
        }

        const newtransaction = await Transaction.create(transactionData)

        const options = {
            amount : amount*100,
            currency : process.env.CURRENCY,
            receipt : newtransaction._id,
        }


        await razorpayInstance.orders.create(options, 
        (error, order) => { 
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error})
            }
            return res.json({ success: true, order})

        })

        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


const verifyRazorpay = async (req, res)=>{
    try {

        

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const {razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid') {
            const transactionData = await Transaction.findById
            (orderInfo.receipt)
            if (transactionData.payment){
                return res.json({ success: false, message: 'payment failed'})

            }
            const userData = await User.findById(transactionData.userId)

            const creditBalance = userData.creditBalance + transactionData.credits

            await User.findByIdAndUpdate(userData._id,{creditBalance})
            await Transaction.findByIdAndUpdate(transactionData._id,{payment: true})

            res.json({ success: true, message:'credits added'})
        }
        else{
            res.json({ success: false, message:'payment failed'})
        }

        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message})
    }
}

export {
    registerUser,
    loginUser,
    userCredit,
    paymentRazorpay,
    verifyRazorpay,
}