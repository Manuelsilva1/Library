import { Component, OnInit, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { SlideItem } from './slide-item.model'; // Importar la interfaz

// Importar Swiper y sus módulos necesarios
import SwiperCore, { Navigation, Pagination, Autoplay, SwiperOptions } from 'swiper';
import { SwiperModule } from 'swiper/angular'; // Importar SwiperModule

// Instalar los módulos de Swiper que se usarán
SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-featured-content-slider',
  templateUrl: './featured-content-slider.component.html',
  styleUrls: ['./featured-content-slider.component.scss'],
  encapsulation: ViewEncapsulation.None, // Para que los estilos de Swiper se apliquen globalmente desde su CSS
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, // Marcar como standalone
  imports: [CommonModule, SwiperModule, RouterModule] // Añadir SwiperModule, CommonModule y RouterModule aquí
})
export class FeaturedContentSliderComponent implements OnInit, AfterViewInit {
  
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

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20, // Espacio entre slides si se muestran varios
    loop: true,
    navigation: true, // Habilita flechas de navegación
    pagination: { clickable: true }, // Habilita puntos de paginación
    autoplay: { delay: 5000, disableOnInteraction: false },
    watchSlidesProgress: true, // Necesario para algunos efectos o estilos basados en el progreso
  };

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Swiper se inicializa a través del componente <swiper> en la plantilla
  }

  // Añadir trackById para el *ngFor
  trackById(index: number, item: SlideItem): number {
    return item.id;
  }
}
