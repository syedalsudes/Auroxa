// src/models/Products.ts
import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "fashion-apparel",
        "topwear",
        "bottomwear",
        "footwear",
        "accessories",
        "toys-hobbies",
      ],
    },
    targetAudience: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex",
    },
    // 🔥 IMAGES
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    images: {
      type: [String],
      default: [],
    },
    // 🔥 PRICING
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: null,
      min: [0, "Discount price cannot be negative"],
    },
    // 🔥 VARIANTS
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    // 🔥 RATINGS & REVIEWS
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // 🔥 INVENTORY
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    // 🔥 FLAGS
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // 🔥 automatically add createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// 🔥 Virtuals
productSchema.virtual("discountPercentage").get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100)
  }
  return 0
})

productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice && this.discountPrice < this.price ? this.discountPrice : this.price
})

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
