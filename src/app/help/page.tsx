export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-lg text-gray500">Find answers to common questions and get the help you need</p>
        </div>

        <div className="space-y-12">

          {/* Account Help */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">👤 Account & Orders</h2>
            <div className="space-y-4">
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">How do I create an account?</summary>
                <p className="text-gray600 mt-2">
                  Click the "Sign In" button in the top right corner and select "Sign Up". You can create an account
                  using your email or social media accounts.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">How can I track my order?</summary>
                <p className="text-gray600 mt-2">
                  You can track your order by visiting "My Orders" in your account or using the tracking link sent to
                  your email after purchase.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">
                  Can I modify or cancel my order?
                </summary>
                <p className="text-gray600 mt-2">
                  Orders can be modified or cancelled within 1 hour of placement. After that, please contact our support
                  team for assistance.
                </p>
              </details>
            </div>
          </section>

          {/* Shipping Help */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🚚 Shipping & Delivery</h2>
            <div className="space-y-4">
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">
                  What are your shipping options?
                </summary>
                <p className="text-gray600 mt-2">
                  We offer standard shipping (7-14 days), express shipping (3-5 days), and same-day delivery in select
                  cities.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">Do you ship internationally?</summary>
                <p className="text-gray600 mt-2">
                  Yes, we ship to over 50 countries worldwide. International shipping takes 10-21 business days.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">
                  What if my package is lost or damaged?
                </summary>
                <p className="text-gray600 mt-2">
                  Contact our support team immediately. We'll investigate and provide a replacement or full refund if
                  the package is confirmed lost or damaged.
                </p>
              </details>
            </div>
          </section>

          {/* Payment Help */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">💳 Payment & Pricing</h2>
            <div className="space-y-4">
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">
                  What payment methods do you accept?
                </summary>
                <p className="text-gray600 mt-2">
                  We accept cash on delivery, credit/debit cards, PayPal, Apple Pay, Google Pay, and bank transfers.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">
                  Is my payment information secure?
                </summary>
                <p className="text-gray600 mt-2">
                  Yes, we use 256-bit SSL encryption and are PCI DSS compliant. We never store your payment card
                  information.
                </p>
              </details>
              <details className="border border-gray300 rounded-lg p-4">
                <summary className="font-semibold text-foreground cursor-pointer">Can I get a refund?</summary>
                <p className="text-gray600 mt-2">
                  Yes, we offer full refunds within 30 days of delivery for unused items in original packaging.
                </p>
              </details>
            </div>
          </section>

          {/* Contact Support */}
          <section className="glass-card text-center">
            <h2 className="text-2xl font-bold text-Orange mb-6">Still Need Help?</h2>
            <p className="text-gray600 mb-6">
              Can't find what you're looking for? Our support team is here to help 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="bg-Orange hover:bg-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/faq"
                className="border border-Orange text-Orange hover:bg-Orange hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                View FAQ
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
