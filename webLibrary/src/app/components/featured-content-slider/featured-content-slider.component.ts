import { Component, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { SlideItem } from './slide-item.model'; // Importar la interfaz

@Component({
  selector: 'app-featured-content-slider',
  templateUrl: './featured-content-slider.component.html',
  styleUrls: ['./featured-content-slider.component.scss'],
  encapsulation: ViewEncapsulation.None, // Para que los estilos se apliquen globalmente
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, // Marcar como standalone
  imports: [CommonModule, RouterModule]
})
export class FeaturedContentSliderComponent implements AfterViewInit {

  slides: SlideItem[] = [
    {
      id: 1,
      title: 'Gran Venta de Clásicos',
      subtitle: 'Hasta 50% de descuento en títulos seleccionados',
      imageUrl: 'assets/images/slider/slide1.jpg', // Placeholder - crea esta ruta y una imagen
      altText: 'Venta de libros clásicos',
      actionText: 'Ver Ofertas',
      actionLink: '/ofertas',
      backgroundColor: '#e0f2f1' // Un color de fondo suave
    },
    {
      id: 2,
      title: 'Novedades Editoriales',
      subtitle: 'Descubre los últimos lanzamientos',
      imageUrl: 'assets/images/slider/slide2.jpg', // Placeholder - crea esta ruta y una imagen
      altText: 'Novedades editoriales',
      actionText: 'Explorar Novedades',
      actionLink: '/catalogo?novedades=true',
      backgroundColor: '#fce4ec'
    },
    {
      id: 3,
      title: 'Los Más Vendidos del Mes',
      subtitle: 'Los libros que todos están leyendo',
      imageUrl: 'assets/images/slider/slide3.jpg', // Placeholder - crea esta ruta y una imagen
      altText: 'Libros más vendidos',
      actionText: 'Ver Lista',
      actionLink: '/catalogo?mas-vendidos=true',
      backgroundColor: '#e3f2fd'
    }
  ];

  constructor() {
  }

  ngAfterViewInit(): void {
    // Swiper se inicializaba aquí, ahora no hay nada relacionado con Swiper.
    // Si este método no hace nada más, se puede eliminar.
  }

  // Añadir trackById para el *ngFor
  trackById(index: number, item: SlideItem): number {
    return item.id;
  }
}