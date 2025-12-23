// utils/emailService.js
import axios from "axios";
import {
  ACCOUNT_CREATION_TEMPLATE,
  notificationEnabledEmailTemplate,
  PASSWORD_RESET_OTP_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../controllers/emailTemplates.js";

/**
 * Generic reusable Brevo email sender
 */
export async function sendBrevoEmail(to, subject, htmlContent) {
  try {
    const payload = {
      sender: {
        name: process.env.SENDER_NAME,
        email: process.env.SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error("Brevo API error:", error.response?.data || error.message);
    throw new Error("Failed to send email. Please try again.");
  }
}

/**
 * Sends account creation confirmation email
 */
export async function accountCreationEmail(fullname, email) {
  return sendBrevoEmail(
    email,
    "Welcome to shophub",
    ACCOUNT_CREATION_TEMPLATE(fullname)
  );
}

/**
 * Sends notification preference update email
 */
export async function notification(fullname, email, notificationType, enabled) {
  return sendBrevoEmail(
    email,
    `Notification ${enabled ? "Enabled" : "Disabled"}: ${notificationType}`,
    notificationEnabledEmailTemplate(fullname, notificationType, enabled)
  );
}


export async function sendVerificationEmail(email, name, verificationCode){
  return sendBrevoEmail(
    email,
    `Hello ${email}`,
    VERIFICATION_EMAIL_TEMPLATE(name, verificationCode)
  )
};


export const sendOtpEmail = async (email, name, otp) => {
  return sendBrevoEmail(
    email,
    `Password Reset otp -Shop Hub`,
    PASSWORD_RESET_OTP_TEMPLATE(name, otp)
  )
};