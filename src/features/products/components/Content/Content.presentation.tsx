// ./src/features/products/components/Content/Content.presentation.tsx
import { AddButton } from '../AddButton';
import { ProductCard } from '../ProductCard';
import { LoadingSpinner, ErrorMessage, Toast } from '../../../../shared/ui';
import type { Product, ProductFormData } from '../../types/product.types';

interface ContentPresentationProps {
  loading: boolean;
  error: string | null;
  displayProducts: Product[];
  toast: any;
  onRetry: () => void;
  onHideToast: () => void;
  onAddProduct: (productData: ProductFormData) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateProduct: (id: number, updatedFields: Partial<Product>) => void;
  onAddToCart: (productId: number) => void;
}

export const ContentPresentation = ({
  loading,
  error,
  displayProducts,
  toast,
  onRetry,
  onHideToast,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onAddToCart,
}: ContentPresentationProps) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  return (
    <div className="p-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={onHideToast} />
      )}
      
      <AddButton onAdd={onAddProduct} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={onDeleteProduct}
            onUpdate={onUpdateProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};