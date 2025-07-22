const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplates = require('../utils/emailTemplates');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // OTP will expire after 5 minutes (300 seconds)
    },
});

// Function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        console.log("Backend (OTP.js): OTP being sent in email:", otp); // Keep this log
        const mailResponse = await mailSender(
            email,
            "Verification Email for RAAH", // <-- THIS IS THE TITLE (Subject)
            emailTemplates.otpVerificationEmail(otp) // <-- THIS IS THE BODY (HTML content)
        );
        console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occurred while sending verification email: ", error);
        throw error;
    }
}

// Pre-save hook to send email before saving the OTP to the database
otpSchema.pre("save", async function (next) {
    console.log("Backend (OTP.js): New OTP document saved to database. this.otp:", this.otp);
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model("OTP", otpSchema);
