export interface SlideItem {
  id: number;
  title: string;
  subtitle?: string; // Para ofertas, descripciones cortas
  imageUrl: string; // URL de la imagen de fondo del slide
  altText?: string; // Texto alternativo para la imagen
  actionText?: string; // Texto para un botón de acción (ej. "Ver más", "Comprar ahora")
  actionLink?: string; // Ruta del enlace para el botón de acción
  backgroundColor?: string; // Color de fondo si la imagen no cubre todo
}
