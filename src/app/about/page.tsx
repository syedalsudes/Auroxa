import type { Metadata } from "next"


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "About Us - Our Story, Mission & Values",
  description:
    "Learn about Auroxa's journey, mission to provide premium fashion, and our commitment to quality, authenticity, and customer satisfaction.",
  keywords: [
    "about auroxa",
    "our story",
    "fashion company",
    "premium fashion",
    "mission",
    "values",
    "quality fashion",
    "authentic products",
  ],
  openGraph: {
    title: "About Auroxa - Premium Fashion & Lifestyle Store",
    description:
      "Discover our story, mission, and commitment to providing premium fashion and lifestyle products with exceptional quality and service.",
    url: `${siteUrl}/about`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: "About Auroxa - Our Story and Mission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Auroxa - Premium Fashion Store",
    description:
      "Learn about our journey and commitment to premium fashion and exceptional customer service.",
    images: [`${siteUrl}/og-about.jpg`],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Auroxa",
            description:
              "Learn about Auroxa's story, mission, and values in premium fashion retail",
            url: `${siteUrl}/about`,
            mainEntity: {
              "@type": "Organization",
              name: "Auroxa",
              description: "Premium fashion and lifestyle e-commerce store",
              foundingDate: "2024",
              founder: {
                "@type": "Person",
                name: "Syed Al-Sudes Hussain",
              },
              mission:
                "To empower individuals to express their unique style through carefully selected, high-quality products",
              values: [
                "Authenticity",
                "Innovation",
                "Sustainability",
                "Community",
              ],
            },
          }),
        }}
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About Auroxa</h1>
            <p className="text-lg text-gray500">Discover our story, mission, and commitment to excellence</p>
          </div>

          <div className="space-y-12">
            {/* Our Story */}
            <section className="glass-card">
              <h2 className="text-2xl font-bold text-Orange mb-6">Our Story</h2>
              <div className="space-y-4 text-gray600">
                <p>
                  Founded with a passion for premium fashion and lifestyle products, Auroxa has been serving customers
                  worldwide with exceptional quality and style. Our journey began with a simple vision: to make premium
                  fashion accessible to everyone.
                </p>
                <p>
                  What started as a small boutique has grown into a trusted online destination for fashion enthusiasts
                  who appreciate quality, craftsmanship, and unique design. We carefully curate each product to ensure
                  it meets our high standards of excellence.
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="glass-card">
              <h2 className="text-2xl font-bold text-Orange mb-6">Our Mission</h2>
              <div className="space-y-4 text-gray600">
                <p>
                  At Auroxa, we believe that fashion is more than just clothing – it's a form of self-expression. Our
                  mission is to empower individuals to express their unique style through carefully selected,
                  high-quality products that reflect their personality and values.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-Orange rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Quality First</h3>
                    <p className="text-sm">Premium materials and exceptional craftsmanship in every product</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-Orange rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Global Reach</h3>
                    <p className="text-sm">Serving customers worldwide with fast and reliable shipping</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-Orange rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💎</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Customer Focus</h3>
                    <p className="text-sm">Exceptional service and support for every customer</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="glass-card">
              <h2 className="text-2xl font-bold text-Orange mb-6">Our Values</h2>
              <div className="space-y-4 text-gray600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Authenticity</h3>
                    <p>
                      We believe in genuine products and honest business practices. Every item in our collection is
                      carefully verified for authenticity and quality.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                    <p>
                      We continuously evolve our platform and services to provide the best shopping experience using the
                      latest technology and trends.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Sustainability</h3>
                    <p>
                      We're committed to responsible business practices and supporting brands that prioritize
                      environmental sustainability.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Community</h3>
                    <p>
                      Building a community of fashion enthusiasts who share our passion for quality, style, and
                      self-expression.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="glass-card text-center">
              <h2 className="text-2xl font-bold text-Orange mb-6">Get in Touch</h2>
              <p className="text-gray600 mb-6">
                Have questions about our products or services? We'd love to hear from you.
              </p>
              <a
                href="/contact-us"
                className="inline-block bg-Orange hover:bg-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Us
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
