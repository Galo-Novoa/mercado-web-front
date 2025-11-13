import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../../app/store/cartStore';
import { ErrorMessage } from '../../../shared/ui/ErrorMessage';
import { useToast } from '../../../shared/lib/useToast';

export const CartPage = () => {
  const { 
    cart, 
    loading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalPrice,
    retry 
  } = useCartStore();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('El carrito está vacío', 'error');
      return;
    }
    navigate('/checkout');
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={retry} />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-lime-50 rounded-lg p-8">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega algunos productos para continuar</p>
        <Link 
          to="/"
          className="bg-lime-500 text-white px-6 py-3 rounded-lg hover:bg-lime-600 transition-colors font-semibold flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Seguir comprando
        </Link>
      </div>
    );
  }

  // ✅ FIX: Función mejorada para calcular precios con oferta
  const calculateDiscountedPrice = (price: number, sale: number) => {
    const safePrice = Number(price) || 0;
    const safeSale = Number(sale) || 0;
    return safePrice * (1 - safeSale / 100);
  };

  const formatPrice = (price: number) => {
    const safePrice = Number(price) || 0;
    return new Intl.NumberFormat("es-AR").format(safePrice);
  };

  // ✅ FIX: Calcular precio total por item considerando oferta
  const getItemTotalPrice = (item: any) => {
    const basePrice = Number(item.product.price) || 0;
    const sale = Number(item.product.sale) || 0;
    const quantity = Number(item.quantity) || 0;
    
    if (sale > 0) {
      const discountedPrice = calculateDiscountedPrice(basePrice, sale);
      return discountedPrice * quantity;
    }
    
    return basePrice * quantity;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link 
          to="/"
          className="flex items-center gap-2 text-lime-600 hover:text-lime-700 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a la tienda
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Tu Carrito</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
          disabled={loading}
        >
          <Trash2 size={20} />
          Vaciar carrito
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {cart.map((item) => {
          const itemTotal = getItemTotalPrice(item);
          const basePrice = Number(item.product.price) || 0;
          const sale = Number(item.product.sale) || 0;
          
          return (
            <div key={item.id} className="border-b border-gray-200 last:border-b-0">
              <div className="flex items-center p-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.product.description}</p>
                  
                  {/* ✅ FIX: Mostrar precio con oferta correctamente */}
                  {sale > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold text-lime-600">
                        ${formatPrice(calculateDiscountedPrice(basePrice, sale))}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${formatPrice(basePrice)}
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{sale}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-lime-600">
                      ${formatPrice(basePrice)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mr-4">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={loading}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={loading}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ${formatPrice(itemTotal)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center gap-1 text-sm disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold text-lime-600">
            ${formatPrice(totalPrice)}
          </span>
        </div>
        
        <div className="flex gap-4">
          <Link 
            to="/"
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors text-center font-semibold"
          >
            Seguir comprando
          </Link>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 bg-lime-500 text-white py-3 px-6 rounded-lg hover:bg-lime-600 transition-colors font-semibold disabled:opacity-50"
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
};