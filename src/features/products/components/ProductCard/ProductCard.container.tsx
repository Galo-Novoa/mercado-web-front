import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCardPresentation } from './ProductCard.presentation';
import { cloudinaryService } from '../../services/cloudinaryService';
import type { Product } from '../../types/product.types';

interface ProductCardContainerProps {
  product: Product & { _ts?: number };
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedFields: Partial<Product>) => void;
  onAddToCart: (productId: number) => void;
}

export const ProductCardContainer: React.FC<ProductCardContainerProps> = ({ 
  product, 
  onDelete, 
  onUpdate, 
  onAddToCart 
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: product.name || "",
    description: product.description || "",
    price: (product.price?.toString() || "0"),
    image: product.image || "",
    rating: (product.rating?.toString() || "0"),
    publisher: product.publisher || "admin",
    sale: (product.sale?.toString() || "0"),
  });
  const [previewImage, setPreviewImage] = useState<string>(product.image || "");

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditValues((prev) => ({ ...prev, image: file as any }));
    setPreviewImage(URL.createObjectURL(file));
    setImageError(false);
  };

  const handleSave = async () => {
    const numericPrice = Number.parseFloat(editValues.price.replaceAll(/[$\s]/g, "")) || 0;
    const numericRating = Number.parseFloat(editValues.rating) || 0;
    const numericSale = Number.parseInt(editValues.sale) || 0;
    
    let imageUrl = product.image || "";

    if (editValues.image && typeof editValues.image !== 'string') {
      try {
        imageUrl = await cloudinaryService.uploadImage(editValues.image);
      } catch (error) {
        console.error("Error al subir imagen:", error);
        imageUrl = product.image || "";
      }
    }

    onUpdate(product.id, {
      name: editValues.name.trim(),
      description: editValues.description.trim(),
      price: numericPrice,
      image: imageUrl,
      rating: numericRating,
      publisher: editValues.publisher.trim(),
      sale: numericSale,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      name: product.name || "",
      description: product.description || "",
      price: (product.price?.toString() || "0"),
      image: product.image || "",
      rating: (product.rating?.toString() || "0"),
      publisher: product.publisher || "admin",
      sale: (product.sale?.toString() || "0"),
    });
    setPreviewImage(product.image || "");
    setIsEditing(false);
  };

  const calculateDiscountedPrice = (price: number = 0, sale: number = 0) => {
    return price * (1 - sale / 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR").format(price || 0);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-AR');
    } catch {
      return "Fecha no disponible";
    }
  };

 return (
    <ProductCardPresentation
      product={product}
      isHovered={isHovered}
      isEditing={isEditing}
      imageError={imageError}
      previewImage={previewImage}
      editValues={editValues}
      onCardClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDelete={(e) => {
        e.stopPropagation();
        onDelete(product.id);
      }}
      onEditToggle={(e) => {
        e.stopPropagation();
        setIsEditing(!isEditing);
      }}
      onAddToCart={(e) => {
        e.stopPropagation();
        onAddToCart(product.id);
      }}
      onFileChange={handleFileChange}
      onEditValuesChange={setEditValues}
      onSave={(e) => {
        e.stopPropagation();
        handleSave();
      }}
      onCancel={(e) => {
        e.stopPropagation();
        handleCancel();
      }}
      onSetImageError={setImageError}
      calculateDiscountedPrice={calculateDiscountedPrice}
      formatPrice={formatPrice}
      formatDate={formatDate}
    />
  );
};