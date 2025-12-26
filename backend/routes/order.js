import express from "express"
import userAuth from "../middleware/userAuth.js"
import { createOrder } from "../controllers/orderController.js";

const orderRouter = express.Router()

orderRouter.post("/",userAuth,createOrder);

export default orderRouter