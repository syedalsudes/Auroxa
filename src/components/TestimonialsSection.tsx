"use client"

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/statistics");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchGlobalReviews() {
      setLoadingReviews(true);
      try {
        const res = await fetch("/api/reviews?limit=5");
        const data = await res.json();
        if (data.success) {
          setTestimonials(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchGlobalReviews();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* 🔥 SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-button text-Orange mb-4">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Customer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray500 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        {/* 🔥 TESTIMONIALS */}
        {loadingReviews ? (
          <div className="text-center text-gray500 animate-pulse">Loading reviews...</div>
        ) : testimonials.length === 0 ? (
          <p className="text-gray500 text-center text-lg">No reviews yet</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card max-w-4xl mx-auto relative overflow-hidden">
              {/* 🔥 TESTIMONIAL CONTENT */}
              <div className="relative h-96 flex items-center justify-center">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial._id || index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0,
                      x: index === currentIndex ? 0 : index < currentIndex ? -100 : 100,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 ${index === currentIndex ? "pointer-events-auto" : "pointer-events-none"
                      }`}
                  >
                    <Quote className="w-12 h-12 text-Orange mb-6 opacity-50" />
                    <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex flex-col items-center">
                      {testimonial.userAvatar ? (
                        <Image
                          src={testimonial.userAvatar}
                          alt={testimonial.userName}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full mb-4 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-Orange text-primaryWhite rounded-full flex items-center justify-center font-semibold mb-4 border-4 border-Orange">
                          {testimonial.userName?.charAt(0) || "U"}
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-foreground mb-1">
                        {testimonial.userName}
                      </h4>
                      <p className="text-gray500 mb-3">{testimonial.userEmail}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-Orange font-medium">
                        Purchased: {testimonial.productName}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 🔥 NAVIGATION ARROWS */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 glass-button p-3 hover:bg-Orange hover:text-white transition-all duration-300"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 glass-button p-3 hover:bg-Orange hover:text-white transition-all duration-300"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* 🔥 DOTS INDICATOR */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? "bg-Orange scale-125"
                      : "bg-gray300 hover:bg-gray400"
                      }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )
        }
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
      >
        {stats ? (
          <>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-Orange mb-2">{stats.happyCustomers}+</div>
              <div className="text-gray500 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-Orange mb-2">{stats.averageRating}</div>
              <div className="text-gray500 font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-Orange mb-2">{stats.productsSold}+</div>
              <div className="text-gray500 font-medium">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-Orange mb-2">{stats.satisfactionRate}%</div>
              <div className="text-gray500 font-medium">Satisfaction Rate</div>
            </div>
          </>
        ) : (
          <>
            {["Happy Customers", "Average Rating", "Products Sold", "Satisfaction Rate"].map((label, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="text-3xl md:text-4xl font-bold text-gray300 mb-2">...</div>
                <div className="text-gray400 font-medium">{label}</div>
              </div>
            ))}
          </>
        )}
      </motion.div>

    </section>
  );
}
