// ./src/features/products/components/AddForm/AddForm.tsx
import { useState, type FormEvent } from "react";
import type { ProductFormData } from '../../types/product.types';
import { useFormValidation } from '../../../../shared/lib/useFormValidation';
import { useCategories } from '../../../../features/categories';
import { Loader2 } from "lucide-react";

interface AddFormProps {
  onAdd: (productData: ProductFormData) => void;
  onClose?: () => void;
}

export const AddForm = ({ onAdd, onClose }: AddFormProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sale, setSale] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { errors, validateProduct, clearErrors } = useFormValidation();
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateProduct({ name, price, description })) {
      return;
    }

    setIsSubmitting(true);
    try {
      const productData: ProductFormData = {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        imageFile,
        sale,
        categoryId: categoryId ? Number(categoryId) : undefined,
      };

      await onAdd(productData);
      
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setSale(0);
      setCategoryId("");
      clearErrors();
      
      if (onClose) onClose();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      alert("Error al agregar el producto. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-lime-300 rounded-xl p-4 mt-4 shadow-xl w-full max-w-[90vw] sm:max-w-[40vw] justify-center text-xl absolute bottom-40 right-10"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Agregar Producto</h3>
      
      <div>
        <input
          placeholder="Nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`bg-white rounded-lg p-2 w-full ${errors.name ? "border-2 border-red-500" : ""}`}
          disabled={isSubmitting}
          aria-label="Nombre del producto"
          aria-required="true"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-red-600 text-sm mt-1 font-medium">{errors.name}</p>}
      </div>

      <div>
        <input
          placeholder="Precio"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          className={`bg-white rounded-lg p-2 w-full ${errors.price ? "border-2 border-red-500" : ""}`}
          disabled={isSubmitting}
          aria-label="Precio del producto"
          aria-required="true"
          aria-invalid={!!errors.price}
        />
        {errors.price && <p className="text-red-600 text-sm mt-1 font-medium">{errors.price}</p>}
      </div>

      <div>
        <textarea
          placeholder="Descripción del producto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full h-32 p-4 rounded-lg resize-none bg-white ${errors.description ? "border-2 border-red-500" : ""}`}
          disabled={isSubmitting}
          aria-label="Descripción del producto"
          aria-required="true"
          aria-invalid={!!errors.description}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700 mt-1">{description.length}/500 caracteres</p>
          {description.length >= 10 && <span className="text-green-600 text-sm">✓</span>}
        </div>
        {errors.description && <p className="text-red-600 text-sm mt-1 font-medium">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="productSale" className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={sale}
          onChange={(e) => setSale(Number(e.target.value))}
          className="bg-white rounded-lg p-2 w-full"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
          className="bg-white rounded-lg p-2 w-full"
          disabled={isSubmitting || categoriesLoading}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
          Imagen del producto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="bg-white rounded-lg p-2 w-full"
          disabled={isSubmitting}
          aria-label="Seleccionar imagen"
        />
        {imageFile && (
          <p className="text-sm text-green-600 mt-1">✓ Archivo seleccionado: {imageFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-lime-500 text-white p-3 rounded-lg mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-lime-600 transition-colors font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Agregando...
          </>
        ) : (
          "Añadir Producto"
        )}
      </button>
    </form>
  );
};