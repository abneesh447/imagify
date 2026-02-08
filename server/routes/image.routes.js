import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { generateImage } from "../controllers/imageController.js";

const router =Router()

router.route('/generate-image').post(verifyJwt,generateImage)

export default router