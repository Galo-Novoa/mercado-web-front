// ./src/features/auth/utils/requestInterceptor.ts
import { authService } from "../services/authService";

// Guardar referencia al fetch original
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
	const url =
		typeof input === "string"
			? input
			: input instanceof URL
			? input.href
			: input.url;

	// ✅ EXCLUIR Cloudinary del interceptor
	if (url && url.includes("cloudinary.com")) {
		return originalFetch(input, init);
	}

	const token = authService.getToken();

	const headers = new Headers(init?.headers);

	if (token && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	if (!headers.has("Content-Type") && init?.method !== "GET") {
		headers.set("Content-Type", "application/json");
	}

	const config: RequestInit = {
		...init,
		headers,
	};

	return originalFetch(input, config);
};

// Exportar originalFetch para usar en cloudinaryService
export { originalFetch };