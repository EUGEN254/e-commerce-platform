import express from "express"
import { getTransactionStatus, initiateMpesaPayment, mpesaCallback } from "../controllers/transactionController.js";
import userAuth from "../middleware/userAuth.js";


const mpesaRouter = express.Router();

// route to initate payment 
mpesaRouter.post("/initiate",userAuth,initiateMpesaPayment);

// route for safaricom response
mpesaRouter.post("/callback",mpesaCallback)

// New route for polling transaction
mpesaRouter.get("/:transactionId", userAuth, getTransactionStatus);

export default mpesaRouter