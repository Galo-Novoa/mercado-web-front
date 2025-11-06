// ./src/App.tsx
import { NavBar } from './features/layout';
import { AppRouter } from './app/router';
import { Toast } from './shared/ui';
import { useCartStore } from './app/store/cartStore';
import { useAuthStore } from './features/auth/store/authStore';
import { useEffect } from 'react';
import { useToast } from './shared/lib/useToast';

export default function App() {
  const { toast, hideToast } = useToast();
  const { loadCart } = useCartStore();
  const { checkAuth } = useAuthStore();

  // Cargar carrito y verificar autenticación al iniciar la app
  useEffect(() => {
    loadCart();
    checkAuth();
  }, [loadCart, checkAuth]);

  return (
    <div className="flex flex-col h-screen bg-lime-100 overflow-y-auto">
      <NavBar />
      <div className="flex-1">
        <AppRouter />
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}