import axios from "axios";
import logger from "./logger.js";

/**
 * Generate timestamp in YYYYMMDDHHMMSS format
 */

export const getTimestamp = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

/**
 * Generate STK Push password (Base64)
 */

export const generatePassword = () => {
  const timeStamp = getTimestamp();
  const raw =
    process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timeStamp;
  return Buffer.from(raw).toString("base64");
};




/**
 * Get OAuth access token from Safaricom
 */

export const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");
  try {
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
  } catch (err) {
    logger.error("Failed to get access token", err.response?.data || err.message);
    throw new Error("M-Pesa auth failed");
  }
};

/**
 * Initiate STK Push
 */

export const stkPush = async ({ phoneNumber, amount, orderId }) => {
  const token = await getAccessToken();
  const password = generatePassword();
  const timeStamp = getTimestamp();

  // Validate phone number format
  if (!phoneNumber || phoneNumber.trim().length < 9) {
    throw new Error("Invalid phone number format");
  }

  // Validate amount
  if (!amount || amount < 1 || amount > 999999) {
    throw new Error("Invalid amount. Must be between 1 and 999999");
  }

  // Normalize phone to 254xxxxxxxx format
  let formattedPhone = phoneNumber.startsWith("0")
    ? `254${phoneNumber.slice(1)}`
    : phoneNumber.startsWith("+254")
    ? phoneNumber.slice(1)
    : phoneNumber;

  // Validate formatted phone has correct length
  if (!/^254\d{9}$/.test(formattedPhone)) {
    throw new Error("Invalid Kenyan phone number format");
  }

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timeStamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount), // Must be integer
    PartyA: formattedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: orderId,
    TransactionDesc: `Payment for order ${orderId}`,
  };


  try {
    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error) {
    logger.error("STK Push failed", error.response?.data || error.message);
    throw new Error("STK Push request failed");
  }
};
