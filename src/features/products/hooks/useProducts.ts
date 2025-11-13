// ./src/features/products/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { productService } from '../services/productService';
import type { Product, ProductFormData } from '../types/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<(Product & { _ts?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data.map((p) => ({ ...p, _ts: Date.now() })));
    } catch (err) {
      setError("Error al cargar los productos. Por favor, intenta de nuevo.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = async (productData: ProductFormData) => {
    try {
      const saved = await productService.addNewProduct(productData);
      setProducts((prev) => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.error("Error al agregar producto:", err);
      throw new Error(
        "No se pudo agregar el producto. Verifica tu conexión e intenta de nuevo."
      );
    }
  };

  const deleteExistingProduct = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      throw new Error("No se pudo eliminar el producto. Intenta de nuevo.");
    }
  };

  const updateExistingProduct = async (
    id: number,
    updatedFields: Partial<Product>
  ) => {
    try {
      const updated = await productService.updateProduct(id, updatedFields);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updated, _ts: Date.now() } : p
        )
      );
      return updated;
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      throw new Error("No se pudo actualizar el producto. Intenta de nuevo.");
    }
  };

  return {
    products,
    loading,
    error,
    addNewProduct,
    deleteExistingProduct,
    updateExistingProduct,
    retry: loadProducts,
  };
};