// ./src/features/products/services/productService.ts
import type { Product, ProductFormData } from "../types/product.types";
import { cloudinaryService } from "./cloudinaryService";

const API_URL = "http://localhost:8080/products";
const PLACEHOLDER_IMAGE = "/placeholder-product.jpg";

const normalizeProduct = (productData: any): Product => {
  let imageUrl = productData.image;
  
  if (!imageUrl || 
      imageUrl.includes('placeholder.com') || 
      imageUrl.includes('undefined') ||
      !imageUrl.startsWith('http') ||
      imageUrl.includes('via.placeholder.com')) {
    imageUrl = PLACEHOLDER_IMAGE;
  }

  return {
    id: productData.id || 0,
    name: productData.name || 'Sin nombre',
    description: productData.description || 'Sin descripción',
    price: Number(productData.price) || 0,
    image: imageUrl,
    rating: Number(productData.rating) || 0,
    publisher: productData.publisher || (productData.user ? productData.user.email : 'admin'),
    dateAdded: productData.dateAdded || new Date().toISOString(),
    sale: Number(productData.sale) || 0,
    category: productData.category
  };
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      console.log("🔄 Obteniendo productos...");
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al cargar productos: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      const normalizedProducts = data.map((product: any) => normalizeProduct(product));
      
      console.log(`✅ ${normalizedProducts.length} productos cargados correctamente`);
      return normalizedProducts;
    } catch (error) {
      console.error('❌ Error en getProducts:', error);
      throw error;
    }
  },

  async addProduct(product: Omit<Product, "id">): Promise<Product> {
    console.log("📤 Enviando producto al servidor:", JSON.stringify(product, null, 2));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      console.log("📨 Respuesta del servidor - Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText || "Error del servidor"}`);
      }

      const savedProduct = await response.json();
      console.log("✅ Producto guardado:", savedProduct);
      
      return normalizeProduct(savedProduct);
    } catch (error) {
      console.error("💥 Error de red:", error);
      throw new Error("Error de conexión. Verifica que el servidor esté funcionando.");
    }
  },

  async deleteProduct(id: number): Promise<void> {
    try {
      console.log(`🔄 Eliminando producto ID: ${id}`);
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al eliminar producto: ${response.status} - ${errorText}`);
      }
      
      console.log(`✅ Producto ${id} eliminado correctamente`);
    } catch (error) {
      console.error('❌ Error en deleteProduct:', error);
      throw error;
    }
  },

  async updateProduct(
    id: number,
    updatedFields: Partial<Omit<Product, "id">>
  ): Promise<Product> {
    try {
      console.log(`🔄 Actualizando producto ID: ${id}`, updatedFields);
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar producto: ${response.status} - ${errorText}`);
      }
      
      const updatedProduct = await response.json();
      console.log("✅ Producto actualizado:", updatedProduct);
      
      return normalizeProduct(updatedProduct);
    } catch (error) {
      console.error('❌ Error en updateProduct:', error);
      throw error;
    }
  },

  async addNewProduct(productData: ProductFormData): Promise<Product> {
    try {
      console.log("🔄 Iniciando addNewProduct con datos:", productData);

      let imageUrl = PLACEHOLDER_IMAGE;
      
      if (productData.imageFile) {
        console.log("🖼️ Subiendo imagen...");
        try {
          imageUrl = await cloudinaryService.uploadImage(productData.imageFile);
          console.log("✅ Imagen subida:", imageUrl);
        } catch (imageError) {
          console.error("❌ Error al subir imagen:", imageError);
          console.log("⚠️ Usando imagen placeholder debido a error de subida");
          imageUrl = PLACEHOLDER_IMAGE;
        }
      } else {
        console.log("ℹ️ No hay imagen para subir, usando placeholder");
      }

      const productToSave: any = {
        name: productData.name.trim(),
        price: Number(productData.price),
        description: productData.description.trim(),
        image: imageUrl,
        rating: 0,
        publisher: "admin",
        sale: productData.sale || 0,
        dateAdded: new Date().toISOString()
      };

      if (productData.categoryId) {
        productToSave.categoryId = productData.categoryId;
      }

      console.log("💾 Producto a guardar:", JSON.stringify(productToSave, null, 2));

      const savedProduct = await this.addProduct(productToSave);
      console.log("🎉 Producto creado exitosamente:", savedProduct);
      return savedProduct;
    } catch (error) {
      console.error("💥 Error en addNewProduct:", error);
      throw error;
    }
  }
};