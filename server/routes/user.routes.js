import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middleware.js";
import { loginUser,  paymentRazorpay,  registerUser, userCredit, verifyRazorpay } from "../controllers/userController.js";

const router =Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/credit-balance").get(verifyJwt,userCredit)
router.route("/pay-razor").post(verifyJwt,paymentRazorpay)
router.route("/verify-razor").post(verifyRazorpay)

export default router