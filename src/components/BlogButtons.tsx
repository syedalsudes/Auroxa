"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductQuickLinks() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product/names");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-10 px-4">
      <h2 className="text-xl font-bold mb-4">Quick Products</h2>
      
      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/blog/${product._id}`}
            className="px-4 py-2 border border-gray400 rounded-full text-sm font-medium text-foreground hover:bg-gray100 transition"
          >
            {product.title || "Unnamed"}
          </Link>
        ))}
      </div>
    </div>
  );
}
