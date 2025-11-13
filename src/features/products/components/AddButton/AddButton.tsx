// ./src/features/products/components/AddButton/AddButton.tsx
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { AddForm } from '../AddForm';
import { motion, AnimatePresence } from "framer-motion";
import type { ProductFormData } from '../../types/product.types';

interface AddButtonProps {
  onAdd: (productData: ProductFormData) => void;
}

export const AddButton = ({ onAdd }: AddButtonProps) => {
  const [showForm, setShowForm] = useState(false);

  const handleClose = () => {
    setShowForm(false);
  };

  const handleAdd = (productData: ProductFormData) => {
    onAdd(productData);
    setShowForm(false);
  };

  return (
    <div>
      <motion.button
        className="fixed bottom-10 right-10 w-20 h-20 bg-lime-500 text-white rounded-full text-2xl transition-all hover:bg-lime-600 hover:scale-110 flex items-center justify-center shadow-lg z-40"
        onClick={() => setShowForm(!showForm)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={showForm ? "Cerrar formulario" : "Agregar nuevo producto"}
      >
        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={40} strokeWidth={4} />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus size={40} strokeWidth={4} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 right-10 z-50 w-96 p-4"
          >
            <AddForm onAdd={handleAdd} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};