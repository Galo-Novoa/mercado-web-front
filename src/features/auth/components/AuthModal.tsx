import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        {mode === 'login' ? (
          <LoginForm 
            onSwitchToRegister={() => setMode('register')} 
            onClose={onClose}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => setMode('login')} 
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};