// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// const mailSender = async (email, title, body) => {
//     try {
//         // *** NEW LOG: Check the email body received by mailSender ***
//         // console.log("Backend (mailSender): Email body received:", body);

//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             },
//             secure: true,
//         });

//         let info = await transporter.sendMail({
//             from: `RAAH - Grievance Redressal System <${process.env.MAIL_USER}>`,
//             to: email,
//             subject: title,
//             html: body,
//         });
//         console.log("Email info: ", info);
//         return info;
//     } catch (error) {
//         console.log(error.message);
//         return error.message;
//     }
// };

// module.exports = mailSender; // <-- ENSURE THIS IS THE EXPORT



const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            secure: true,
        });

        const cleanedRecipients = Array.isArray(email) ? email.filter(Boolean).join(',') : email;

        const info = await transporter.sendMail({
            from: `RAAH - Grievance Redressal System <${process.env.MAIL_USER}>`,
            to: cleanedRecipients, // FIXED HERE
            subject: title,
            html: body,
        });

        console.log("✅ Email sent:", info);
        return info;
    } catch (error) {
        console.log("Error sending email:", error.message);
        return error.message;
    }
};

module.exports = mailSender;


module.exports = mailSender;
