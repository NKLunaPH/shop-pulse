import { Request, Response } from "express";
import { PRODUCTS_DB, Product } from "../data/mockData.js";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let results = [...PRODUCTS_DB];

    if (category && category !== "All") {
      results = results.filter(
        (p) => p.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (maxPrice) {
      results = results.filter((p) => p.price <= parseFloat(maxPrice as string));
    }

    if (sort === "price-asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else {
      results.sort((a, b) => b.pulseScore - a.pulseScore);
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = PRODUCTS_DB.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      pulseScore: 90,
      inStock: true,
      images: [req.body.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
      ...req.body,
    };

    PRODUCTS_DB.push(newProduct);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
