export const ACCOUNT_CREATION_TEMPLATE = (fullname) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Shop Hub!</title>
  <style>
    body {
      background: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      background: #ffffff;
      width: 90%;
      max-width: 600px;
      margin: 30px auto;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border-top: 4px solid #7c3aed;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #7c3aed;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    .logo-icon {
      color: #7c3aed;
      margin-right: 5px;
    }
    .welcome-title {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 20px 0 10px;
    }
    .subtitle {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 25px;
    }
    .content {
      color: #374151;
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .highlight {
      background: #f3f4f6;
      padding: 25px;
      border-radius: 10px;
      margin: 25px 0;
      border-left: 4px solid #7c3aed;
    }
    .highlight h3 {
      color: #7c3aed;
      margin-top: 0;
      font-size: 18px;
    }
    .features {
      margin: 25px 0;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    .feature-icon {
      color: #10b981;
      margin-right: 12px;
      font-size: 18px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: #ffffff !important;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      margin: 25px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }
    .btn:hover {
      background: linear-gradient(135deg, #6d28d9, #5b21b6);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
    }
    .shopping-perks {
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }
    .shopping-perks h3 {
      color: #92400e;
      margin-top: 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-icon {
      display: inline-block;
      margin: 0 10px;
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;
    }
    .disclaimer {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 20px;
      line-height: 1.5;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
    }
    .customer-name {
      color: #7c3aed;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">🛍️</span>Shop Hub
      </div>
      <h1 class="welcome-title">Welcome to Shop Hub!</h1>
      <p class="subtitle">Your ultimate shopping destination</p>
    </div>

    <div class="content">
      <p>Hi <span class="customer-name">${fullname}</span>,</p>
      
      <p>🎉 Welcome to Shop Hub! We're thrilled to have you join our community of smart shoppers.</p>
      
      <p>Your account has been successfully created and you're now ready to explore thousands of products from top brands at amazing prices.</p>

      <div class="highlight">
        <h3>🎁 Welcome Bonus!</h3>
        <p>As a new member, you automatically receive:</p>
        <ul>
          <li>15% off your first order (use code: WELCOME15)</li>
          <li>Free shipping on orders over $50</li>
          <li>Exclusive member-only deals</li>
        </ul>
      </div>

      <div class="features">
        <h3>✨ What you can do with your Shop Hub account:</h3>
        
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>Shop seamlessly</strong> - Browse millions of products across all categories
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>Track orders</strong> - Real-time updates from cart to delivery
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>Wishlist favorites</strong> - Save items for later and get price drop alerts
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>Quick checkout</strong> - Save payment & shipping info for faster purchases
          </div>
        </div>
        
        <div class="feature-item">
          <span class="feature-icon">✓</span>
          <div>
            <strong>Earn rewards</strong> - Collect points on every purchase for future discounts
          </div>
        </div>
      </div>

      <div class="shopping-perks">
        <h3>🌟 Exclusive Member Benefits:</h3>
        <p>As a Shop Hub member, you'll get:</p>
        <ul>
          <li>Early access to sales and new arrivals</li>
          <li>Birthday surprises and special offers</li>
          <li>Priority customer support</li>
          <li>Personalized recommendations based on your style</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="{{loginLink}}" class="btn">Start Shopping Now →</a>
      </p>

      <p>Need help or have questions? Our support team is available 24/7 to assist you with anything from product inquiries to order tracking.</p>
    </div>

    <div class="footer">
      <p>Happy Shopping,</p>
      <p><strong>The Shop Hub Team</strong></p>
      
      <div class="social-links">
        <a href="#" class="social-icon">Instagram</a> •
        <a href="#" class="social-icon">Facebook</a> •
        <a href="#" class="social-icon">Twitter</a> •
        <a href="#" class="social-icon">Pinterest</a>
      </div>
      
      <p class="disclaimer">
        This email was sent to you as a registered user of Shop Hub.<br>
        If you did not create this account, please contact our support team immediately.<br>
        © 2025 Shop Hub. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;


export const notificationEnabledEmailTemplate = (fullname, notificationType, enabled) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Notification ${enabled ? "Enabled" : "Disabled"}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background-color: #ffffff;
          margin: 30px auto;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: ${enabled ? "#2ecc71" : "#e63946"};
          color: #ffffff;
          text-align: center;
          padding: 20px;
          font-size: 22px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
        }
        .content h2 {
          color: ${enabled ? "#2ecc71" : "#e63946"};
        }
        .footer {
          background-color: #f5f5f5;
          text-align: center;
          font-size: 14px;
          color: #777777;
          padding: 15px;
        }
        .btn {
          display: inline-block;
          padding: 10px 18px;
          background-color: ${enabled ? "#2ecc71" : "#e63946"};
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          SafeCity Notification ${enabled ? "Enabled" : "Disabled"}
        </div>
        <div class="content">
          <h2>Hello ${fullname || "User"},</h2>
          <p>
            You’ve successfully <strong>${enabled ? "enabled" : "disabled"} ${notificationType}</strong> notifications
            on your SafeCity account.
          </p>
          ${
            enabled
              ? `<p>We’ll keep you informed about important updates related to your chosen category.</p>`
              : `<p>You will no longer receive updates for this category, but you can re-enable them anytime.</p>`
          }
          <a href="https://safecity.example.com/settings" class="btn">Manage Notifications</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SafeCity. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`;


// utils/emailService.js
export const VERIFICATION_EMAIL_TEMPLATE = (name, verificationCode) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email - Shop Hub</title>
  <style>
    body {
      background: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      background: #ffffff;
      width: 90%;
      max-width: 600px;
      margin: 30px auto;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border-top: 4px solid #7c3aed;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #7c3aed;
      margin-bottom: 10px;
    }
    .verification-code {
      background: #f3f4f6;
      border: 2px dashed #7c3aed;
      padding: 25px;
      border-radius: 10px;
      text-align: center;
      margin: 30px 0;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 10px;
      color: #7c3aed;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: #ffffff !important;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      margin: 25px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">🛍️ Shop Hub</div>
      <h1>Verify Your Email Address</h1>
    </div>

    <div class="content">
      <p>Hi <strong>${name}</strong>,</p>
      
      <p>Thank you for registering with Shop Hub! To complete your registration and start shopping, please verify your email address by entering the code below:</p>

      <div class="verification-code">${verificationCode}</div>

      <p>This code will expire in <strong>15 minutes</strong>. If you didn't request this verification, please ignore this email.</p>

      <p>Need help? Contact our support team at support@shophub.com</p>
    </div>

    <div class="footer">
      <p>© 2025 Shop Hub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;



// utils/emailService.js
export const PASSWORD_RESET_OTP_TEMPLATE = (name, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset OTP - Shop Hub</title>
  <style>
    body {
      background: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      background: #ffffff;
      width: 90%;
      max-width: 600px;
      margin: 30px auto;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border-top: 4px solid #7c3aed;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #7c3aed;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }
    .logo-icon {
      color: #7c3aed;
      margin-right: 5px;
    }
    .title {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 20px 0 10px;
    }
    .subtitle {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 25px;
    }
    .content {
      color: #374151;
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 30px;
    }
    .otp-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
      border: 1px solid #e5e7eb;
    }
    .otp-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
      display: block;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #7c3aed;
      margin: 15px 0;
      font-family: 'SF Mono', Monaco, 'Courier New', monospace;
      background: white;
      padding: 20px;
      border-radius: 8px;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
    }
    .time-warning {
      background: #fef3c7;
      border: 1px solid #fde68a;
      padding: 15px 20px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }
    .time-warning h3 {
      color: #92400e;
      margin: 0 0 10px 0;
      font-size: 16px;
    }
    .steps {
      margin: 25px 0;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .step-number {
      background: #7c3aed;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .step-content {
      flex: 1;
    }
    .step-content strong {
      color: #1f2937;
      display: block;
      margin-bottom: 5px;
    }
    .security-notice {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
      border-left: 4px solid #ef4444;
    }
    .security-notice h3 {
      color: #dc2626;
      margin-top: 0;
      font-size: 16px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: #ffffff !important;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      margin: 25px 0;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    }
    .btn:hover {
      background: linear-gradient(135deg, #6d28d9, #5b21b6);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
    }
    .customer-name {
      color: #7c3aed;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-icon {
      display: inline-block;
      margin: 0 10px;
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;
    }
    .disclaimer {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 20px;
      line-height: 1.5;
    }
    .help-section {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 20px;
      border-radius: 10px;
      margin: 25px 0;
    }
    .help-section h3 {
      color: #065f46;
      margin-top: 0;
    }
    ul {
      padding-left: 20px;
      margin: 15px 0;
    }
    li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">🛍️</span>Shop Hub
      </div>
      <h1 class="title">Password Reset Request</h1>
      <p class="subtitle">Use the OTP below to reset your password</p>
    </div>

    <div class="content">
      <p>Hi <span class="customer-name">${name}</span>,</p>
      
      <p>We received a request to reset your Shop Hub account password. To complete the process, please use the One-Time Password (OTP) below:</p>

      <div class="otp-container">
        <span class="otp-label">Your One-Time Password</span>
        <div class="otp-code">${otp}</div>
        <p style="color: #6b7280; margin-top: 15px; font-size: 14px;">
          This OTP is valid for <strong>15 minutes</strong>
        </p>
      </div>

      <div class="time-warning">
        <h3>⏰ Time Sensitive</h3>
        <p>This OTP will expire in 15 minutes for security reasons. If you don't use it within this time, you'll need to request a new one.</p>
      </div>

      <div class="steps">
        <h3>📝 How to use this OTP:</h3>
        
        <div class="step-item">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Go to Password Reset Page</strong>
            <p>Return to the Shop Hub password reset page where you requested this OTP.</p>
          </div>
        </div>
        
        <div class="step-item">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Enter the OTP</strong>
            <p>Copy and paste or type the 6-digit code above into the verification field.</p>
          </div>
        </div>
        
        <div class="step-item">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>Create New Password</strong>
            <p>Once verified, you'll be prompted to create a new secure password for your account.</p>
          </div>
        </div>
      </div>

      <div class="security-notice">
        <h3>🔒 Security Notice</h3>
        <p><strong>Important:</strong> Never share this OTP with anyone. Shop Hub staff will never ask for your OTP, password, or other verification codes.</p>
        <ul>
          <li>This OTP is for one-time use only</li>
          <li>It will expire in 15 minutes</li>
          <li>If you didn't request this password reset, please ignore this email</li>
        </ul>
      </div>

      <div class="help-section">
        <h3>❓ Need Help?</h3>
        <p>If you're having trouble resetting your password or didn't request this reset, please:</p>
        <ul>
          <li>Contact our support team immediately at <strong>support@shophub.com</strong></li>
          <li>Review your account activity for any suspicious behavior</li>
          <li>Ensure your email account is secure</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="{{resetLink}}" class="btn">Reset Your Password →</a>
      </p>

      <p><strong>Not you?</strong> If you didn't request a password reset, your account may be at risk. Please secure your account immediately by:</p>
      <ul>
        <li>Changing your password if you can still access your account</li>
        <li>Enabling two-factor authentication</li>
        <li>Contacting our security team at <strong>security@shophub.com</strong></li>
      </ul>
    </div>

    <div class="footer">
      <p>Stay connected with us:</p>
      
      <div class="social-links">
        <a href="#" class="social-icon">Instagram</a> •
        <a href="#" class="social-icon">Facebook</a> •
        <a href="#" class="social-icon">Twitter</a> •
        <a href="#" class="social-icon">Pinterest</a>
      </div>
      
      <p class="disclaimer">
        This email was sent in response to a password reset request for your Shop Hub account.<br>
        For your security, this OTP will expire in 15 minutes.<br>
        If you have any concerns about the security of your account, please contact us immediately.<br>
        © 2025 Shop Hub. All rights reserved. | <a href="#" style="color: #7c3aed;">Privacy Policy</a> | <a href="#" style="color: #7c3aed;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

