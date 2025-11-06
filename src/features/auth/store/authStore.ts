import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          authService.setToken(response.token);
          
          const user: User = {
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            isAdmin: response.roles.includes('ROLE_ADMIN')
          };
          
          authService.setUser(user);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al iniciar sesión', 
            loading: false 
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.register(userData);
          authService.setToken(response.token);
          
          const user: User = {
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            isAdmin: response.roles.includes('ROLE_ADMIN')
          };
          
          authService.setUser(user);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al registrar usuario', 
            loading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, loading: false, error: null });
        } catch (error) {
          set({ loading: false });
          console.error('Error al cerrar sesión:', error);
        }
      },

      checkAuth: async () => {
        if (!authService.isTokenValid()) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        const savedUser = authService.getUser();
        if (savedUser) {
          set({ user: savedUser, isAuthenticated: true });
          return;
        }

        set({ loading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, loading: false });
          await authService.logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);