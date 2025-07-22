exports.otpVerificationEmail = (otp) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eeeeee;
                }
                .header h1 {
                    color: #333333;
                    margin: 0;
                }
                .content {
                    padding: 20px 0;
                    text-align: center;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #555555;
                }
                .otp-code {
                    font-size: 32px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                    padding: 10px 20px;
                    background-color: #e9f5ff;
                    border-radius: 5px;
                    display: inline-block;
                }
                .footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #eeeeee;
                    font-size: 12px;
                    color: #aaaaaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>RAAH - Grievance Redressal System</h1>
                </div>
                <div class="content">
                    <p>Thank you for registering with RAAH. Please use the following One-Time Password (OTP) to complete your verification:</p>
                    <div class="otp-code">${otp}</div>
                    <p>This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} RAAH. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

exports.welcomeEmail = (firstName) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Welcome to RAAH!</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
                .header h1 { color: #333333; margin: 0; }
                .content { padding: 20px 0; }
                .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #aaaaaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to RAAH!</h1>
                </div>
                <div class="content">
                    <p>Hello ${firstName},</p>
                    <p>Thank you for registering with RAAH - your dedicated Grievance Redressal System.</p>
                    <p>You can now submit and track your grievances efficiently.</p>
                    <p>We are committed to providing a transparent and efficient platform for citizens to raise concerns and for government departments to address them promptly.</p>
                    <p>For any queries, please do not reply to this email. Use the contact options on the portal.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} RAAH. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

exports.staffWelcomeEmail = (firstName, accountType, email) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Welcome to RAAH - Staff Account</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
                .header h1 { color: #333333; margin: 0; }
                .content { padding: 20px 0; }
                .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #aaaaaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to RAAH - Staff Account</h1>
                </div>
                <div class="content">
                    <p>Hello ${firstName},</p>
                    <p>Your account as <strong>${accountType}</strong> has been successfully created on the RAAH Grievance Redressal System.</p>
                    <p>Your login email is: <strong>${email}</strong></p>
                    <p>Please use your provided password to log in and start managing grievances.</p>
                    <p>For any queries, please contact the system administrator.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} RAAH. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

exports.passwordResetEmail = (resetUrl) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset Request</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
                .header h1 { color: #333333; margin: 0; }
                .content { padding: 20px 0; }
                .content p { font-size: 16px; line-height: 1.6; color: #555555; }
                .button-container { text-align: center; margin: 20px 0; }
                .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #aaaaaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>You have requested a password reset for your RAAH account.</p>
                    <p>Please click the button below to reset your password:</p>
                    <div class="button-container">
                        <a href="${resetUrl}" class="button">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>This link is valid for 1 hour only.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} RAAH. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
