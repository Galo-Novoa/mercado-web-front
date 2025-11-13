import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { LoadingSpinner } from '../../../../shared/ui/LoadingSpinner';
import { ErrorMessage } from '../../../../shared/ui/ErrorMessage';
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../../../app/store/cartStore';
import { useToast } from '../../../../shared/lib/useToast';
import { ProductDetailPagePresentation } from './ProductDetailPage.presentation';

export const ProductDetailPageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, error, retry } = useProducts();
  const { addToCart } = useCartStore();
  const { toast, showToast, hideToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  const safeRating = product?.rating ?? 0;
  const safePrice = product?.price ?? 0;
  const safeSale = product?.sale ?? 0;
  const safePublisher = product?.publisher ?? "admin";
  const safeName = product?.name ?? "Producto sin nombre";
  const safeDescription = product?.description ?? "Sin descripción disponible";

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
      }
      showToast(`${quantity} producto(s) agregado(s) al carrito`, 'success');
    } catch {
      showToast('Error al agregar al carrito', 'error');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const renderStars = (rating: number = 0) => {
    const safeRating = rating;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${i}`}
        size={20}
        className={i < Math.floor(safeRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const calculateDiscountedPrice = (price: number = 0, sale: number = 0) => {
    return price * (1 - sale / 100);
  };

  const formatPrice = (price: number = 0) => {
    return new Intl.NumberFormat("es-AR").format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR');
    } catch {
      return "Fecha no disponible";
    }
  };

  const discountedPrice = calculateDiscountedPrice(safePrice, safeSale);

  const productImages = product ? Array.from({ length: 3 }, (_, i) => ({
    id: `image-${i}`,
    url: product.image
  })) : [];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Producto no encontrado</h2>
        <Link 
          to="/"
          className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailPagePresentation
      product={product}
      safeRating={safeRating}
      safePrice={safePrice}
      safeSale={safeSale}
      safePublisher={safePublisher}
      safeName={safeName}
      safeDescription={safeDescription}
      toast={toast}
      selectedImage={selectedImage}
      quantity={quantity}
      productImages={productImages}
      discountedPrice={discountedPrice}
      onHideToast={hideToast}
      onNavigateBack={() => navigate(-1)}
      onSetSelectedImage={setSelectedImage}
      onSetQuantity={setQuantity}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      renderStars={renderStars}
      formatPrice={formatPrice}
      formatDate={formatDate}
    />
  );
};