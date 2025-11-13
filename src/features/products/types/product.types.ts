// ./src/features/products/types/product.types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  publisher: string;
  dateAdded: string;
  sale: number;
  category?: Category;
  _ts?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
export interface ProductFormData {
  name: string;
  price: number | '';
  description: string;
  imageFile?: File | null;
  sale: number;
  categoryId?: number;
  image?: string;
  rating?: number;
  publisher?: string;
  dateAdded?: string;
}