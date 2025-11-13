// ./src/features/products/components/Content/Content.container.tsx
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../../../app/store/cartStore';
import { useToast } from '../../../../shared/lib/useToast';
import { ContentPresentation } from './Content.presentation';
import type { Product, ProductFormData } from '../../types/product.types';

interface ContentContainerProps {
  filteredProducts: Product[];
}

export const ContentContainer = ({ filteredProducts }: ContentContainerProps) => {
  const { 
    products, 
    loading, 
    error, 
    addNewProduct, 
    deleteExistingProduct, 
    updateExistingProduct, 
    retry 
  } = useProducts();
  
  const { addToCart } = useCartStore();
  const { toast, showToast, hideToast } = useToast();

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      // ✅ CORREGIDO: Usar addNewProduct que acepta ProductFormData
      await addNewProduct(productData);
      showToast("Producto agregado exitosamente", "success");
    } catch {
      showToast("Error al agregar el producto", "error");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteExistingProduct(id);
      showToast("Producto eliminado", "info");
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Error al eliminar el producto", "error");
    }
  };

  const handleUpdateProduct = async (id: number, updatedFields: Partial<Product>) => {
    try {
      await updateExistingProduct(id, updatedFields);
      showToast("Producto actualizado", "success");
    } catch (err) {
      console.error("Error updating product:", err);
      showToast("Error al actualizar el producto", "error");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId);
      showToast("Producto agregado al carrito", "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Error al agregar al carrito", "error");
    }
  };

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <ContentPresentation
      loading={loading}
      error={error}
      displayProducts={displayProducts}
      toast={toast}
      onRetry={retry}
      onHideToast={hideToast}
      onAddProduct={handleAddProduct}
      onDeleteProduct={handleDeleteProduct}
      onUpdateProduct={handleUpdateProduct}
      onAddToCart={handleAddToCart}
    />
  );
};