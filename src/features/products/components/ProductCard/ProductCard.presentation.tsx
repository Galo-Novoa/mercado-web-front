import React from "react";
import {
	AlertCircle,
	Trash2,
	Pencil,
	Check,
	X as CancelIcon,
	ShoppingCart,
	Star,
} from "lucide-react";
import type { Product } from "../../types/product.types";

interface ProductCardPresentationProps {
	product: Product & { _ts?: number };
	isHovered: boolean;
	isEditing: boolean;
	imageError: boolean;
	previewImage: string;
	editValues: {
		name: string;
		description: string;
		price: string;
		image: string | File;
		rating: string;
		publisher: string;
		sale: string;
	};
	onCardClick: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onDelete: (e: React.MouseEvent) => void;
	onEditToggle: (e: React.MouseEvent) => void;
	onAddToCart: (e: React.MouseEvent) => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onEditValuesChange: (values: any) => void;
	onSave: (e: React.MouseEvent) => void;
	onCancel: (e: React.MouseEvent) => void;
	calculateDiscountedPrice: (price: number, sale: number) => number;
	formatPrice: (price: number) => string;
	formatDate: (dateString: string) => string;
	onSetImageError: (error: boolean) => void;
}

const renderStars = (rating: number) => {
	const safeRating = rating || 0;
	return [...Array(5)].map((_, i) => (
		<Star
			key={i}
			size={16}
			className={
				i < Math.floor(safeRating)
					? "text-yellow-400 fill-yellow-400"
					: "text-gray-300"
			}
		/>
	));
};

export const ProductCardPresentation: React.FC<
	ProductCardPresentationProps
> = ({
	product,
	isHovered,
	isEditing,
	imageError,
	previewImage,
	editValues,
	onCardClick,
	onMouseEnter,
	onMouseLeave,
	onDelete,
	onEditToggle,
	onAddToCart,
	onFileChange,
	onEditValuesChange,
	onSave,
	onSetImageError,
	onCancel,
	calculateDiscountedPrice,
	formatPrice,
	formatDate,
}) => {
	return (
		<fieldset
			className="relative border rounded-xl shadow-md p-4 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden w-full flex"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onMouseEnter}
			onBlur={onMouseLeave}
			onClick={onCardClick}
		>
			{/* Botones flotantes */}
			<button
				onClick={onDelete}
				className={`w-12 h-12 flex items-center justify-center absolute top-2 right-2 bg-red-500 text-white rounded-full transition-all duration-300 z-10 hover:bg-red-600 ${
					isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
				}`}
				aria-label="Eliminar producto"
				title="Eliminar producto"
			>
				<Trash2 size={25} />
			</button>

			<button
				onClick={onEditToggle}
				className={`w-12 h-12 flex items-center justify-center absolute top-15 right-2 bg-blue-500 text-white rounded-full transition-all duration-300 z-10 hover:bg-blue-600 ${
					isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
				}`}
				aria-label="Editar producto"
				title={isEditing ? "Cancelar edición" : "Editar producto"}
			>
				{isEditing ? <CancelIcon size={28} /> : <Pencil size={22} />}
			</button>

			{!isEditing && (
				<button
					className={`w-12 h-12 flex items-center justify-center absolute top-28 right-2 bg-lime-500 text-white rounded-full transition-all duration-300 z-10 hover:bg-lime-600 ${
						isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
					}`}
					aria-label="Añadir al carrito"
					title="Añadir al carrito"
					style={{ transitionProperty: "opacity, transform" }}
					onClick={onAddToCart}
				>
					<ShoppingCart size={24} />
				</button>
			)}

			{/* Contenedor de dos columnas */}
			<div className="flex w-full gap-4">
				{/* Columna izquierda: imagen */}
				<div className="w-1/2 h-48 w-60 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
					{imageError ? (
						<div className="flex flex-col items-center justify-center w-full h-full">
							<AlertCircle className="text-gray-400 mb-2" size={48} />
							<span className="text-gray-500 text-sm">
								Imagen no disponible
							</span>
						</div>
					) : (
						<img
							src={isEditing ? previewImage : product.image || ""}
							alt={product.name || "Producto sin nombre"}
							className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
							onError={(e) => {
								// ✅ FIX: Si la imagen falla, usar placeholder
								(e.target as HTMLImageElement).src = "/placeholder-product.jpg";
								onSetImageError(true);
							}}
						/>
					)}
					{isEditing && (
						<input
							type="file"
							accept="image/*"
							onChange={onFileChange}
							className="absolute bottom-2 left-2"
							onClick={(e) => e.stopPropagation()}
						/>
					)}
				</div>

				{/* Columna derecha: contenido */}
				<div className="flex flex-col flex-1 gap-2">
					{isEditing ? (
						<>
							<input
								value={editValues.name}
								onChange={(e) =>
									onEditValuesChange({ ...editValues, name: e.target.value })
								}
								className="text-lg font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500"
								onClick={(e) => e.stopPropagation()}
							/>
							<textarea
								value={editValues.description}
								onChange={(e) =>
									onEditValuesChange({
										...editValues,
										description: e.target.value,
									})
								}
								className="text-gray-600 text-sm border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500 resize-none truncate line-clamp-3"
								onClick={(e) => e.stopPropagation()}
							/>
							<div className="grid grid-cols-2 gap-2">
								<input
									value={editValues.rating}
									onChange={(e) =>
										onEditValuesChange({
											...editValues,
											rating: e.target.value,
										})
									}
									className="text-sm border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500"
									placeholder="Rating"
									onClick={(e) => e.stopPropagation()}
								/>
								<input
									value={editValues.sale}
									onChange={(e) =>
										onEditValuesChange({ ...editValues, sale: e.target.value })
									}
									className="text-sm border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500"
									placeholder="Descuento %"
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
							<input
								value={editValues.publisher}
								onChange={(e) =>
									onEditValuesChange({
										...editValues,
										publisher: e.target.value,
									})
								}
								className="text-sm border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500"
								placeholder="Vendedor"
								onClick={(e) => e.stopPropagation()}
							/>
							<input
								value={editValues.price}
								onChange={(e) =>
									onEditValuesChange({ ...editValues, price: e.target.value })
								}
								className="text-2xl font-bold text-lime-600 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-lime-500"
								onClick={(e) => e.stopPropagation()}
							/>
							<div className="mt-2 flex gap-2">
								<button
									onClick={onSave}
									className="bg-lime-500 text-white px-4 py-1 rounded hover:bg-lime-600 flex items-center"
								>
									<Check size={16} className="inline mr-1" /> Guardar
								</button>
								<button
									onClick={onCancel}
									className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 flex items-center"
								>
									<CancelIcon size={16} className="inline mr-1" /> Cancelar
								</button>
							</div>
						</>
					) : (
						<>
							<h2 className="text-lg font-bold text-gray-800 line-clamp-2">
								{product.name || "Producto sin nombre"}
							</h2>

							{/* Rating y Categoría */}
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-1">
									{renderStars(product.rating || 0)}
									<span className="text-sm text-gray-500">
										({(product.rating || 0).toFixed(1)})
									</span>
								</div>
								{product.category && (
									<span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded-full">
										{product.category.name}
									</span>
								)}
							</div>

							{/* Publisher */}
							<p className="text-sm text-gray-500">
								Vendido por: {product.publisher || "admin"}
							</p>

							<p className="text-gray-600 text-sm line-clamp-3 flex-1">
								{product.description || "Sin descripción"}
							</p>

							<div className="mt-auto pt-2 border-t border-gray-200">
								{/* Precio con descuento */}
								{(product.sale || 0) > 0 ? (
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold text-red-500">
											-{product.sale}%
										</span>
										<div className="flex flex-col">
											<span className="text-xl font-bold text-lime-600">
												$
												{formatPrice(
													calculateDiscountedPrice(
														Number(product.price || 0),
														product.sale || 0
													)
												)}
											</span>
											<span className="text-sm text-gray-400 line-through">
												${formatPrice(Number(product.price || 0))}
											</span>
										</div>
									</div>
								) : (
									<p className="text-2xl font-bold text-black">
										${formatPrice(Number(product.price || 0))}
									</p>
								)}

								{/* Fecha de agregado */}
								<p className="text-xs text-gray-400 mt-1">
									Agregado: {formatDate(product.dateAdded)}
								</p>
							</div>
						</>
					)}
				</div>
			</div>

			<div
				className={`absolute bottom-0 left-0 right-0 h-1 bg-lime-500 transition-all duration-300 ${
					isHovered ? "opacity-100" : "opacity-0"
				}`}
			/>
		</fieldset>
	);
};
