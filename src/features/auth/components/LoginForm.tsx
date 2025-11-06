import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../../../shared/lib/useToast";

interface LoginFormProps {
	onSwitchToRegister: () => void;
	onClose: () => void;
}

export const LoginForm = ({ onSwitchToRegister, onClose }: LoginFormProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login, loading, error, clearError } = useAuthStore();
	const { showToast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();

		try {
			await login({ email, password });
			showToast("¡Bienvenido!", "success");
			onClose();
		} catch (error) {
			// El error ya está manejado en el store
		}
	};

	return (
		<div className="bg-white rounded-2xl p-6 w-96 max-w-[90vw]">
			<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
				Iniciar Sesión
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{error}
					</div>
				)}

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-black"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Contraseña
					</label>
					<div className="relative">
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 pr-10 text-black"
							required
							disabled={loading}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-lime-500 text-white py-3 px-4 rounded-lg hover:bg-lime-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							Iniciando sesión...
						</>
					) : (
						"Iniciar Sesión"
					)}
				</button>
			</form>

			<div className="mt-4 text-center">
				<p className="text-gray-600 text-sm">
					¿No tienes cuenta?{" "}
					<button
						onClick={onSwitchToRegister}
						className="text-lime-600 hover:text-lime-700 font-semibold"
						disabled={loading}
					>
						Regístrate aquí
					</button>
				</p>
			</div>
		</div>
	);
};
