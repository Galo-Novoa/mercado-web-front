import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, LogIn } from "lucide-react";
import { useAuthStore } from "../../../../features/auth/store/authStore";
import { AuthModal } from "../../../../features/auth/components/AuthModal";

export const ProfileMenu = () => {
	const [open, setOpen] = useState(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const { user, isAuthenticated, logout } = useAuthStore();

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const handleLogout = async () => {
		await logout();
		setOpen(false);
	};

	const handleLoginClick = () => {
		setOpen(false);
		setAuthModalOpen(true);
	};

	return (
		<>
			<div ref={ref} className="relative inline-block text-left">
				<button
					onClick={() => setOpen((prev) => !prev)}
					className="focus:outline-none flex items-center justify-center hover:ring-4 hover:ring-lime-300 rounded-full transition-all"
					aria-label="Abrir menú de perfil"
					aria-expanded={open}
				>
					<img
						src={user?.avatarUrl || "/user.jpg"}
						alt="Perfil"
						className="h-13 aspect-square rounded-full cursor-pointer hover:brightness-95 transition"
					/>
				</button>

				{open && (
					<div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
						<ul className="flex flex-col py-2 text-sm text-gray-700">
							{isAuthenticated ? (
								<>
									<li>
										<div className="px-4 py-2 border-b border-gray-200">
											<p className="font-semibold text-gray-800">
												{user?.firstName} {user?.lastName}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{user?.email}
											</p>
											{user?.isAdmin && (
												<span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
													Admin
												</span>
											)}
										</div>
									</li>
									<li>
										<button
											className="w-full text-left px-4 py-2 hover:bg-lime-100 cursor-pointer flex items-center gap-2 transition-colors"
											onClick={() => setOpen(false)}
										>
											<User size={16} />
											Perfil
										</button>
									</li>
									<li>
										<button
											className="w-full text-left px-4 py-2 hover:bg-lime-100 cursor-pointer flex items-center gap-2 transition-colors"
											onClick={() => setOpen(false)}
										>
											<Settings size={16} />
											Configuración
										</button>
									</li>
									<li className="border-t border-gray-200 mt-1 pt-1">
										<button
											className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 transition-colors"
											onClick={handleLogout}
										>
											<LogOut size={16} />
											Cerrar sesión
										</button>
									</li>
								</>
							) : (
								<li>
									<button
										className="w-full text-left px-4 py-2 text-lime-600 hover:bg-lime-50 cursor-pointer flex items-center gap-2 transition-colors"
										onClick={handleLoginClick}
									>
										<LogIn size={16} />
										Iniciar sesión
									</button>
								</li>
							)}
						</ul>
					</div>
				)}
			</div>

			<AuthModal
				isOpen={authModalOpen}
				onClose={() => setAuthModalOpen(false)}
			/>
		</>
	);
};
