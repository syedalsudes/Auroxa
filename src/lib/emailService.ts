import nodemailer from "nodemailer"

// Fix the type issue - proper transporter creation
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

// Test transporter function
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true }
  } catch (error) {
    console.error("❌ Email server connection failed:", error)
    return { success: false, error }
  }
}

// Email templates for different statuses
export const getEmailTemplate = (status: string, order: any) => {
  const customerName = order.shippingAddress.fullName
  const orderNumber = order.orderNumber
  const orderDate = new Date(order.createdAt).toLocaleDateString()
  const totalAmount = order.total.toLocaleString()
  const trackingId = `TRK${orderNumber.slice(-6)}`

  const templates = {
    confirmed: {
      subject: `✅ Order Confirmed - ${orderNumber} | Auroxa`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong>${customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #28a745; font-weight: bold;">Great news! Your order has been confirmed and is now being processed! ✅</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #333; margin-top: 0;">📋 Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td style="padding: 8px 0;">${orderNumber}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Order Date:</td><td style="padding: 8px 0;">${orderDate}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Total Amount:</td><td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">₹${totalAmount}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">Confirmed ✅</td></tr>
              </table>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">🚀 What's Next?</h4>
              <ul style="color: #333; padding-left: 20px;">
                <li>Our team is preparing your items for shipment</li>
                <li>🚚 Getting ready for shipment (7-14 days delivery)</li>
                <li>We'll keep you updated via email at every step</li>
              </ul>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ffeaa7;">
              <p style="margin: 0; color: #856404;"><strong>💡 Pro Tip:</strong> Save this email for your records and tracking information!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/my-orders" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">View Order Details</a>
            </div>

            <p style="font-size: 16px;">Thank you for choosing <strong>Auroxa</strong>! We're excited to get your order to you soon! 🎁</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              <strong>The Auroxa Team</strong><br>
              📧 Email: support@auroxa.com<br>
              🌐 Website: <a href="${process.env.NEXT_PUBLIC_BASE_URL}">www.auroxa.com</a>
            </p>
          </div>
        </body>
        </html>
      `,
    },

    processing: {
      subject: `⚙️ Order Processing - ${orderNumber} | Auroxa`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Processing</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #667eea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⚙️ Order Processing!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong>${customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #8b5cf6; font-weight: bold;">Your order is now being processed by our fulfillment team! ⚙️</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #333; margin-top: 0;">📋 Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td style="padding: 8px 0;">${orderNumber}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td style="padding: 8px 0; color: #8b5cf6; font-weight: bold;">Processing ⚙️</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Total Amount:</td><td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">₹${totalAmount}</td></tr>
              </table>
            </div>

            <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #8b5cf6; margin-top: 0;">📦 Current Status:</h4>
              <ul style="color: #333; padding-left: 20px;">
                <li>✅ Items are being picked from our warehouse</li>
                <li>🔍 Quality check in progress</li>
                <li>📦 Preparing for secure packaging</li>
                <li>🚚 Getting ready for shipment (7-14 days delivery)</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/track-order" style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Order</a>
            </div>

            <p style="font-size: 16px;">You'll receive tracking information once your order is shipped! 📧</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              <strong>The Auroxa Team</strong>
            </p>
          </div>
        </body>
        </html>
      `,
    },

    shipped: {
      subject: `🚚 Order Shipped - ${orderNumber} | Track: ${order.shippingDetails?.trackingId || "N/A"}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Shipped</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Order Shipped!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong>${customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #f97316; font-weight: bold;">Great news! Your order has been shipped and is on its way to you! 🚚</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">📦 Tracking Information:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td style="padding: 8px 0;">${orderNumber}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Tracking ID:</td><td style="padding: 8px 0; color: #f97316; font-weight: bold; font-size: 18px;">${order.shippingDetails?.trackingId || "Processing..."}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Courier Company:</td><td style="padding: 8px 0;">${order.shippingDetails?.courierName || "Standard Delivery"}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Expected Delivery:</td><td style="padding: 8px 0; color: #28a745; font-weight: bold;">7-14 business days</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td style="padding: 8px 0; color: #f97316; font-weight: bold;">Shipped 🚚</td></tr>
              </table>
            </div>

            ${
              order.shippingDetails?.trackingUrl
                ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${order.shippingDetails.trackingUrl}" 
                 style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🔍 Track Your Package
              </a>
            </div>
            `
                : `
            <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="color: #f97316; margin-top: 0;">📍 Tracking Details:</h4>
              <p style="color: #333; margin: 10px 0;">Your package is being prepared for shipment.</p>
              <p style="color: #666; font-size: 14px;">Tracking information will be available soon!</p>
            </div>
            `
            }

            <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #f97316; margin-top: 0;">📋 Delivery Instructions:</h4>
              <ul style="color: #333; padding-left: 20px;">
                <li>📱 You may receive SMS updates from ${order.shippingDetails?.courierName || "our courier partner"}</li>
                <li>📞 Courier may call before delivery</li>
                <li>🏠 Please ensure someone is available to receive the package</li>
                <li>🆔 Keep your CNIC/ID ready for verification</li>
                <li>📦 Check items immediately upon delivery</li>
              </ul>
            </div>

            ${
              order.shippingDetails?.trackingId
                ? `
            <div style="background: #f97316; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; font-size: 16px;">Your Tracking ID: <strong style="font-size: 20px;">${order.shippingDetails.trackingId}</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Save this for tracking your package</p>
            </div>
            `
                : ""
            }
          </div>
        </body>
        </html>
      `,
    },

    delivered: {
      subject: `📦 Order Delivered - ${orderNumber} | Auroxa`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Delivered</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Delivered!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Dear <strong>${customerName}</strong>,</p>
            
            <p style="font-size: 16px; color: #22c55e; font-weight: bold;">Congratulations! Your order has been successfully delivered! 🎉</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #22c55e;">
              <h3 style="color: #333; margin-top: 0;">✅ Delivery Confirmation:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold;">Order Number:</td><td style="padding: 8px 0;">${orderNumber}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Delivered On:</td><td style="padding: 8px 0; color: #22c55e; font-weight: bold;">${new Date().toLocaleDateString()}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Total Amount:</td><td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">₹${totalAmount}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Status:</td><td style="padding: 8px 0; color: #22c55e; font-weight: bold;">Delivered ✅</td></tr>
              </table>
            </div>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #22c55e; margin-top: 0;">💝 We Hope You Love Your Purchase!</h4>
              <ul style="color: #333; padding-left: 20px;">
                <li>📦 Please check your items carefully</li>
                <li>📞 Contact us immediately if you have any issues</li>
                <li>⭐ Don't forget to rate your experience</li>
                <li>📱 Share your experience on social media</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact-us" style="background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">Rate Experience ⭐</a>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/blog" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">Shop Again 🛍️</a>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="color: #d97706; margin-top: 0;">🎁 Special Offer!</h4>
              <p style="color: #92400e; margin: 10px 0;">Get <strong>10% OFF</strong> on your next order!</p>
              <p style="color: #92400e; font-size: 14px;">Use code: <strong>WELCOME10</strong></p>
            </div>

            <p style="font-size: 16px;">Thank you for choosing <strong>Auroxa</strong>! We look forward to serving you again! 🙏</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              Best regards,<br>
              <strong>The Auroxa Team</strong><br>
              ❤️ Thank you for being an amazing customer!
            </p>
          </div>
        </body>
        </html>
      `,
    },
  }

  return templates[status as keyof typeof templates] || null
}

// Enhanced send email function with better error handling
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {

    const transporter = createTransporter()

    // Test connection first
    await transporter.verify()

    const mailOptions = {
      from: `"Auroxa Store" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    }

    const result = await transporter.sendMail(mailOptions)

    return { success: true, messageId: result.messageId }
  } catch (error: any) {
    console.error("❌ Email error:", error.message)
    console.error("❌ Error code:", error.code)
    return { success: false, error: error }
  }
}

// Simple test email function
export const sendTestEmail = async (to: string) => {
  const testHtml = `
    <h1>🧪 Test Email from Auroxa</h1>
    <p>If you receive this email, your email configuration is working correctly!</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `

  return await sendEmail(to, "🧪 Test Email - Auroxa", testHtml)
}
