export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-lg text-gray500">Comprehensive solutions for all your fashion and lifestyle needs</p>
        </div>

        <div className="space-y-12">
          {/* Personal Shopping */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🛍️ Personal Shopping</h2>
            <div className="space-y-4 text-gray600">
              <p>
                Our expert stylists provide personalized shopping assistance to help you find the perfect items that
                match your style, preferences, and budget.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Style Consultation</h3>
                  <p className="text-sm">One-on-one sessions with professional stylists</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Curated Collections</h3>
                  <p className="text-sm">Handpicked items based on your preferences</p>
                </div>
              </div>
            </div>
          </section>

          {/* Custom Tailoring */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">✂️ Custom Tailoring</h2>
            <div className="space-y-4 text-gray600">
              <p>Professional alteration and custom tailoring services to ensure the perfect fit for your garments.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Alterations</h3>
                  <p className="text-sm">Hemming, taking in, letting out</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Custom Fit</h3>
                  <p className="text-sm">Made-to-measure garments</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Repairs</h3>
                  <p className="text-sm">Professional garment repairs</p>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Delivery */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🚚 Premium Delivery</h2>
            <div className="space-y-4 text-gray600">
              <p>
                Multiple delivery options to suit your schedule and preferences, from standard shipping to same-day
                delivery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Express Delivery</h3>
                  <p className="text-sm">Next-day delivery in major cities</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">White Glove Service</h3>
                  <p className="text-sm">Premium packaging and handling</p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Support */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">💬 24/7 Customer Support</h2>
            <div className="space-y-4 text-gray600">
              <p>
                Round-the-clock customer support through multiple channels to assist you with any questions or concerns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
                  <p className="text-sm">Instant support on our website</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
                  <p className="text-sm">Dedicated helpline available 24/7</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                  <p className="text-sm">Detailed assistance via email</p>
                </div>
              </div>
            </div>
          </section>

          {/* Loyalty Program */}
          <section className="glass-card">
            <h2 className="text-2xl font-bold text-Orange mb-6">🎁 Loyalty Program</h2>
            <div className="space-y-4 text-gray600">
              <p>
                Join our exclusive loyalty program to earn points, receive special discounts, and get early access to
                new collections.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Earn Points</h3>
                  <p className="text-sm">Get points for every purchase and referral</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Exclusive Access</h3>
                  <p className="text-sm">Early access to sales and new arrivals</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="glass-card text-center">
            <h2 className="text-2xl font-bold text-Orange mb-6">Need More Information?</h2>
            <p className="text-gray600 mb-6">
              Contact our team to learn more about our services and how we can help you.
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-Orange hover:bg-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Get in Touch
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
