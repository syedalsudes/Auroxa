export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Policies</h1>
          <p className="text-lg text-gray500">Everything you need to know about shopping with Auroxa</p>
          <div id="shipping"></div>
        </div>

        <div className="space-y-12">
          {/* Shipping Policy */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🚚 Shipping Policy</h2>
            <div className="space-y-4 text-gray600">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Delivery Time</h3>
                <p>• Standard Delivery: 7-14 business days</p>
                <p>• Express Delivery: 3-5 business days (additional charges apply)</p>
                <p>• Same Day Delivery: Available in select cities</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Shipping Charges</h3>
                <p>• Free shipping on orders above $50</p>
                <p>• Standard shipping: $5.99</p>
                <p>• Express shipping: $12.99</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">International Shipping</h3>
                <p>• Available to 50+ countries</p>
                <p>• Delivery time: 10-21 business days</p>
                <p>• Customs duties may apply</p>
              </div>
            </div>
            <div id="returns"></div>
          </section>

          {/* Return Policy */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">↩️ Return & Exchange Policy</h2>
            <div className="space-y-4 text-gray600">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Return Window</h3>
                <p>• 30 days from delivery date</p>
                <p>• Items must be unused and in original packaging</p>
                <p>• Original receipt or order confirmation required</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Return Process</h3>
                <p>1. Contact our support team</p>
                <p>2. Receive return authorization and shipping label</p>
                <p>3. Pack items securely and ship back</p>
                <p>4. Refund processed within 5-7 business days</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Non-Returnable Items</h3>
                <p>• Personalized or customized products</p>
                <p>• Intimate apparel and swimwear</p>
                <p>• Perishable goods</p>
                <p>• Digital downloads</p>
              </div>
            </div>
            <div id="privacy"></div>
          </section>

          {/* Privacy Policy */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🔒 Privacy Policy</h2>
            <div className="space-y-4 text-gray600">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
                <p>• Personal information (name, email, address)</p>
                <p>• Payment information (securely processed)</p>
                <p>• Browsing behavior and preferences</p>
                <p>• Device and location information</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
                <p>• Process orders and payments</p>
                <p>• Provide customer support</p>
                <p>• Send order updates and promotional emails</p>
                <p>• Improve our services and user experience</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
                <p>• SSL encryption for all transactions</p>
                <p>• Secure data storage and processing</p>
                <p>• No sharing with third parties without consent</p>
                <p>• Right to access, modify, or delete your data</p>
              </div>
            </div>
            <div id="terms"></div>
          </section>

          {/* Terms of Service */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">📋 Terms of Service</h2>
            <div className="space-y-4 text-gray600">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Account Responsibilities</h3>
                <p>• Provide accurate and complete information</p>
                <p>• Maintain account security and confidentiality</p>
                <p>• Notify us of unauthorized account access</p>
                <p>• Use the service in compliance with applicable laws</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Prohibited Activities</h3>
                <p>• Fraudulent or illegal transactions</p>
                <p>• Harassment or abuse of other users</p>
                <p>• Violation of intellectual property rights</p>
                <p>• Attempting to breach security measures</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                <p>• Service provided "as is" without warranties</p>
                <p>• Not liable for indirect or consequential damages</p>
                <p>• Maximum liability limited to purchase amount</p>
                <p>• Force majeure events excluded from liability</p>
              </div>
            </div>
            <div id="payment"></div>
          </section>

          {/* Payment Policy */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">💳 Payment Policy</h2>
            <div className="space-y-4 text-gray600">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Accepted Payment Methods</h3>
                <p>• Cash on Delivery (COD)</p>
                <p>• Credit/Debit Cards (Visa, MasterCard, American Express)</p>
                <p>• Digital Wallets (PayPal, Apple Pay, Google Pay)</p>
                <p>• Bank Transfer</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Payment Security</h3>
                <p>• PCI DSS compliant payment processing</p>
                <p>• 256-bit SSL encryption</p>
                <p>• No storage of payment card information</p>
                <p>• Fraud detection and prevention measures</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Pricing & Currency</h3>
                <p>• All prices displayed in USD</p>
                <p>• Prices include applicable taxes</p>
                <p>• Prices subject to change without notice</p>
                <p>• Currency conversion rates may apply</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="glass-card text-center">
            <h2 className="text-2xl font-bold text-Orange mb-6">📞 Questions About Our Policies?</h2>
            <p className="text-gray600 mb-6">
              If you have any questions about our policies, please don't hesitate to contact us.
            </p>
            <div className="sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="bg-Orange hover:bg-dark text-white px-10 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
