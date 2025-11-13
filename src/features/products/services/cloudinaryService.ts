// ./src/features/products/services/cloudinaryService.ts

// ✅ Guardar referencia a fetch original para usar en Cloudinary
const originalFetch = window.fetch;

export const cloudinaryService = {
  async uploadImage(file: File): Promise<string> {
    try {
      console.log("🔄 Obteniendo firma de Cloudinary...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const sigRes = await fetch("http://localhost:8080/cloudinary/signature", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!sigRes.ok) {
        throw new Error(`Error al obtener firma: ${sigRes.status}`);
      }

      const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("upload_preset", "ml_preset"); // ✅ AGREGAR EL UPLOAD PRESET

      console.log("🔄 Subiendo imagen a Cloudinary...");

      // ✅ Usar fetch original directamente (sin interceptor)
      const cloudRes = await originalFetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      if (!cloudRes.ok) {
        const errorData = await cloudRes.text();
        throw new Error(`Error Cloudinary ${cloudRes.status}: ${errorData}`);
      }

      const data = await cloudRes.json();
      console.log("✅ Imagen subida exitosamente:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("❌ Error en cloudinaryService:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Timeout: La subida de imagen tardó demasiado");
        }
        throw new Error(`No se pudo subir la imagen: ${error.message}`);
      } else {
        throw new Error("No se pudo subir la imagen. Verifica tu configuración de Cloudinary.");
      }
    }
  },
};