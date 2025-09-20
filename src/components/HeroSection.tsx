import { ShoppingBag, Star, Truck, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 md:-mt-20 xxl:h-[700px]">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xxl:-mt-20">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          {/* LEFT (Text) - Mobile me upar, lg me left */}
          <div className="text-center lg:text-left order-1 lg:order-1 mt-8 lg:mt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-button text-primaryWhite mb-4 sm:mb-5 md:mb-6">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">Premium Fashion Store</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-primaryWhite mb-3 sm:mb-4 md:mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Perfect Style
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray100 mb-6 sm:mb-7 md:mb-8 max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 px-2 sm:px-4 lg:px-0 leading-relaxed">
              Curated collection of premium fashion, accessories, and lifestyle products. Quality guaranteed, style
              delivered.
            </p>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2 sm:px-4 lg:px-0">
              <Link href="/blog">
                <button className="group bg-primaryWhite text-deepBlack px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-white transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 w-full xs:w-auto min-w-[140px] sm:min-w-[160px]">
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  Shop Now
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <button className="glass-button text-primaryWhite border-2 border-primaryWhite hover:bg-primaryWhite hover:text-deepBlack w-full xs:w-auto min-w-[140px] sm:min-w-[160px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold rounded-full transition-all duration-300">
                View Collection
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start mt-6 sm:mt-8 md:mt-12 px-2 sm:px-4 lg:px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-primaryWhite">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300" />
                <span className="text-xs sm:text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-primaryWhite">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300" />
                <span className="text-xs sm:text-sm font-medium">Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-primaryWhite">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-300" />
                <span className="text-xs sm:text-sm font-medium">5-Star Rated</span>
              </div>
            </div>
          </div>

          {/* RIGHT (Image) - Mobile me neeche, lg me right */}
          <div className="relative flex justify-center lg:justify-end order-2 lg:order-2">
            <div className="relative group">
              <Image
                src="/herosectionpic.svg"
                alt="Fashion Collection"
                width={800}
                height={800}
                className="relative w-[200px] h-[280px] xs:w-[240px] xs:h-[340px] sm:w-[300px] sm:h-[420px] md:w-[350px] md:h-[500px] lg:w-[400px] lg:h-[600px] xl:w-[450px] xl:h-[700px] 2xl:w-[500px] 2xl:h-[800px] mt-2 sm:mt-4 md:mt-6 lg:mt-10 object-cover select-none transform group-hover:scale-105 transition-all duration-500 drop-shadow-[0_3px_15px_rgba(255,165,0,0.25)] sm:drop-shadow-[0_5px_20px_rgba(255,165,0,0.3)] md:drop-shadow-[0_10px_35px_rgba(255,165,0,0.3)] group-hover:drop-shadow-[0_8px_25px_rgba(255,165,0,0.4)] sm:group-hover:drop-shadow-[0_10px_30px_rgba(255,165,0,0.4)] md:group-hover:drop-shadow-[0_20px_50px_rgba(255,165,0,0.4)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
