"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useToast } from "@/components/ToastContainer";
import { Product } from "@/types/product";

interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: (p: Product[]) => void;

  category: string | null;
  setCategory: (c: string | null) => void;

  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  createProduct: (productData: any) => Promise<{ success: boolean; data?: Product; message?: string }>;
  updateProduct: (id: string, productData: any) => Promise<{ success: boolean; data?: Product; message?: string }>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  uploadImages: (files: File[]) => Promise<{ success: boolean; uploaded?: string[]; error?: string }>;
  generateSlug: (title: string) => string;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const showSuccess = (title: string, message: string) => toast?.showSuccess(title, message);
  const showError = (title: string, message: string) => toast?.showError(title, message);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/product", { cache: "no-store" });
      const data = await res.json();

      let list: Product[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      setProducts(list);
      setFilteredProducts(list);
    } catch {
      setError("Error fetching data from the API.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ filter products automatically when category changes
  useEffect(() => {
    if (category) {
      setFilteredProducts(products.filter((p) => p.category?.toLowerCase() === category.toLowerCase()));
    } else {
      setFilteredProducts(products);
    }
  }, [category, products]);

  const createProduct = async (productData: any) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (result?.success) {
        const newItem: Product = result.data;
        setProducts((prev) => [newItem, ...prev]);
        setFilteredProducts((prev) => [newItem, ...prev]);
        showSuccess?.("Product Added", "Product has been added successfully.");
        return { success: true, data: newItem };
      } else {
        showError?.("Product Creation Failed", result?.message || "Failed to create product");
        return { success: false, message: result?.message };
      }
    } catch {
      showError?.("Error", "Something went wrong. Please try again.");
      return { success: false, message: "Network error" };
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      if (result?.success) {
        const updated: Product = result.data;
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        setFilteredProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        showSuccess?.("Product Updated", "Product has been updated successfully.");
        return { success: true, data: updated };
      } else {
        showError?.("Update Failed", result?.message || "Failed to update product");
        return { success: false, message: result?.message };
      }
    } catch {
      showError?.("Error", "Something went wrong. Please try again.");
      return { success: false, message: "Network error" };
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return false;
    try {
      const response = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
        showSuccess?.("Product Deleted", "Product has been deleted successfully");
        return true;
      } else {
        showError?.("Delete Failed", "Failed to delete product");
        return false;
      }
    } catch {
      showError?.("Error", "Error deleting product");
      return false;
    }
  };

  const getProductById = (id: string) => products.find((p) => p._id === id);
  const getProductsByCategory = (category: string) =>
    products.filter((p) => p.category?.toLowerCase() === category?.toLowerCase());

  const searchProducts = (query: string) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        (p.title?.toLowerCase().includes(q) ?? false) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false)
    );
  };

  const uploadImages = async (files: File[]) => {
    if (!files?.length) {
      showError?.("No Files", "Please select at least one image");
      return { success: false, error: "No files provided" };
    }
    if (files.length > 4) {
      showError?.("Too Many Files", "Maximum 4 images allowed");
      return { success: false, error: "Maximum 4 images allowed" };
    }
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result?.success) {
        showSuccess?.("Images Uploaded", "All images uploaded successfully");
        return { success: true, uploaded: result.uploaded as string[] };
      } else {
        showError?.("Upload Failed", result?.error || "Upload failed");
        return { success: false, error: result?.error || "Upload failed" };
      }
    } catch {
      showError?.("Network Error", "Failed to upload images");
      return { success: false, error: "Network error during upload" };
    }
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductsContextType = {
    products,
    filteredProducts,
    setFilteredProducts,
    category,
    setCategory,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    searchProducts,
    uploadImages,
    generateSlug,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};
