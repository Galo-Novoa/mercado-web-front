import { create } from "zustand";

interface Product {
	id: number;
	name: string;
	description: string;
	price: number;
	image: string;
	rating: number;
	publisher: string;
	dateAdded: string;
	sale: number;
	category?: any;
}

interface CartItem {
	id: number;
	product: Product;
	quantity: number;
	username: string;
}

interface CartStore {
	cart: CartItem[];
	loading: boolean;
	error: string | null;
	cartItemCount: number;
	totalPrice: number;

	loadCart: () => Promise<void>;
	addToCart: (productId: number) => Promise<void>;
	removeFromCart: (productId: number) => Promise<void>;
	updateQuantity: (productId: number, newQuantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
	retry: () => void;
}

// ✅ FIX: Función para normalizar productos del backend
const normalizeProduct = (productData: any): Product => {
	return {
		id: productData.id || 0,
		name: productData.name || "Sin nombre",
		description: productData.description || "Sin descripción",
		price: Number(productData.price) || 0,
		image:
			productData.image ||
			"https://via.placeholder.com/300x300?text=Sin+Imagen",
		rating: Number(productData.rating) || 0,
		publisher:
			productData.publisher ||
			(productData.user ? productData.user.email : "admin"),
		dateAdded: productData.dateAdded || new Date().toISOString(),
		sale: Number(productData.sale) || 0,
		category: productData.category,
	};
};

// ✅ FIX: Servicio mejorado con manejo robusto de errores
const cartService = {
	async getCart(): Promise<{ items: CartItem[]; total: number }> {
		try {
			const API_URL = "http://localhost:8080/cart";
			const CURRENT_USER = "demo-user";

			console.log("🔄 Cargando carrito...");
			const response = await fetch(`${API_URL}?username=${CURRENT_USER}`);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error ${response.status}: ${errorText}`);
			}

			const data = await response.json();

			// ✅ FIX: Normalizar los productos del carrito
			const normalizedItems: CartItem[] = data.items.map((item: any) => ({
				id: item.id,
				product: normalizeProduct(item.product),
				quantity: item.quantity || 1,
				username: item.username || CURRENT_USER,
			}));

			console.log("✅ Carrito cargado:", normalizedItems.length, "items");
			return { items: normalizedItems, total: data.total || 0 };
		} catch (error) {
			console.error("❌ Error en getCart:", error);
			// Retornar carrito vacío en caso de error
			return { items: [], total: 0 };
		}
	},

	async addToCart(productId: number): Promise<CartItem> {
		try {
			const API_URL = "http://localhost:8080/cart";
			const CURRENT_USER = "demo-user";

			console.log("🔄 Agregando producto al carrito:", productId);
			const response = await fetch(`${API_URL}/add`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: CURRENT_USER,
					productId: productId,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || `Error HTTP ${response.status}`);
			}

			const data = await response.json();

			// ✅ FIX: Normalizar la respuesta
			const normalizedItem: CartItem = {
				id: data.id,
				product: normalizeProduct(data.product),
				quantity: data.quantity || 1,
				username: data.username || CURRENT_USER,
			};

			console.log("✅ Producto agregado al carrito:", normalizedItem);
			return normalizedItem;
		} catch (error) {
			console.error("❌ Error en addToCart:", error);
			throw error;
		}
	},

	async removeFromCart(productId: number): Promise<void> {
		try {
			const API_URL = "http://localhost:8080/cart";
			const CURRENT_USER = "demo-user";

			console.log("🔄 Eliminando producto del carrito:", productId);
			const response = await fetch(`${API_URL}/remove`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: CURRENT_USER,
					productId: productId,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || `Error HTTP ${response.status}`);
			}

			console.log("✅ Producto eliminado del carrito:", productId);
		} catch (error) {
			console.error("❌ Error en removeFromCart:", error);
			throw error;
		}
	},
};

// ✅ FIX: Función mejorada para calcular precio con oferta
const calculateItemPrice = (item: CartItem): number => {
	const basePrice = Number(item.product.price) || 0;
	const sale = Number(item.product.sale) || 0;
	const quantity = Number(item.quantity) || 0;

	if (sale > 0 && sale <= 100) {
		const discountedPrice = basePrice * (1 - sale / 100);
		return Number((discountedPrice * quantity).toFixed(2));
	}

	return Number((basePrice * quantity).toFixed(2));
};

export const useCartStore = create<CartStore>((set, get) => ({
	cart: [],
	loading: false,
	error: null,
	cartItemCount: 0,
	totalPrice: 0,

	loadCart: async () => {
		set({ loading: true, error: null });
		try {
			const response = await cartService.getCart();

			// ✅ FIX: Calcular totalPrice correctamente considerando ofertas
			const totalPrice = response.items.reduce(
				(sum: number, item: CartItem) => {
					return sum + calculateItemPrice(item);
				},
				0
			);

			set({
				cart: response.items,
				cartItemCount: response.items.reduce(
					(sum: number, item: CartItem) => sum + (item.quantity || 1),
					0
				),
				totalPrice: totalPrice,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al cargar el carrito";
			set({
				error: errorMessage,
				cart: [],
				cartItemCount: 0,
				totalPrice: 0,
			});
			console.error("❌ Error loading cart:", error);
		} finally {
			set({ loading: false });
		}
	},

	addToCart: async (productId: number) => {
		// ✅ FIX: Remover la declaración innecesaria de cart
		const currentState = get();
		const loadCart = currentState.loadCart;

		set({ error: null });

		try {
			const newItem = await cartService.addToCart(productId);

			set((state) => {
				const existingIndex = state.cart.findIndex(
					(item: CartItem) => item.product.id === productId
				);
				let updatedCart: CartItem[];

				if (existingIndex >= 0) {
					updatedCart = state.cart.map((item, index) =>
						index === existingIndex
							? { ...item, quantity: (item.quantity || 1) + 1 }
							: item
					);
				} else {
					updatedCart = [...state.cart, newItem];
				}

				const totalPrice = updatedCart.reduce((sum: number, item: CartItem) => {
					return sum + calculateItemPrice(item);
				}, 0);

				return {
					cart: updatedCart,
					cartItemCount: updatedCart.reduce(
						(sum: number, item: CartItem) => sum + (item.quantity || 1),
						0
					),
					totalPrice: totalPrice,
				};
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al agregar al carrito";
			set({ error: errorMessage });
			console.error("❌ Error adding to cart:", error);
			await loadCart();
		}
	},

	removeFromCart: async (productId: number) => {
		// ✅ FIX: Obtener el estado actual correctamente
		const currentState = get();
		const loadCart = currentState.loadCart;

		set({ error: null });

		try {
			await cartService.removeFromCart(productId);
			set((state) => {
				const updatedCart = state.cart.filter(
					(item: CartItem) => item.product.id !== productId
				);

				// ✅ FIX: Calcular totalPrice correctamente
				const totalPrice = updatedCart.reduce((sum: number, item: CartItem) => {
					return sum + calculateItemPrice(item);
				}, 0);

				return {
					cart: updatedCart,
					cartItemCount: updatedCart.reduce(
						(sum: number, item: CartItem) => sum + (item.quantity || 1),
						0
					),
					totalPrice: totalPrice,
				};
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al eliminar del carrito";
			set({ error: errorMessage });
			console.error("❌ Error removing from cart:", error);
			await loadCart();
		}
	},

	updateQuantity: async (productId: number, newQuantity: number) => {
		if (newQuantity <= 0) {
			await get().removeFromCart(productId);
			return;
		}

		// ✅ FIX: Remover la declaración innecesaria de cart
		const currentState = get();
		const loadCart = currentState.loadCart;

		set({ error: null });

		try {
			const currentItem = currentState.cart.find(
				(item: CartItem) => item.product.id === productId
			);
			if (!currentItem) return;

			const difference = newQuantity - (currentItem.quantity || 1);

			if (difference > 0) {
				for (let i = 0; i < difference; i++) {
					await cartService.addToCart(productId);
				}
			} else if (difference < 0) {
				for (let i = 0; i < Math.abs(difference); i++) {
					await cartService.removeFromCart(productId);
				}
			}

			set((state) => {
				const updatedCart = state.cart.map((item: CartItem) =>
					item.product.id === productId
						? { ...item, quantity: newQuantity }
						: item
				);

				const totalPrice = updatedCart.reduce((sum: number, item: CartItem) => {
					return sum + calculateItemPrice(item);
				}, 0);

				return {
					cart: updatedCart,
					cartItemCount: updatedCart.reduce(
						(sum: number, item: CartItem) => sum + (item.quantity || 1),
						0
					),
					totalPrice: totalPrice,
				};
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al actualizar cantidad";
			set({ error: errorMessage });
			console.error("❌ Error updating quantity:", error);
			await loadCart();
		}
	},

	clearCart: async () => {
		// ✅ FIX: Remover la declaración innecesaria de cart
		const currentState = get();
		const loadCart = currentState.loadCart;

		set({ error: null });

		try {
			const deletePromises = currentState.cart.map((item: CartItem) =>
				cartService.removeFromCart(item.product.id)
			);
			await Promise.all(deletePromises);
			set({ cart: [], cartItemCount: 0, totalPrice: 0 });
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error al vaciar el carrito";
			set({ error: errorMessage });
			console.error("❌ Error clearing cart:", error);
			await loadCart();
		}
	},

	retry: () => {
		get().loadCart();
	},
}));