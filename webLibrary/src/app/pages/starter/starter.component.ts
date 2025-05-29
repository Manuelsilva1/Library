import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FeaturedContentSliderComponent } from '../../components/featured-content-slider/featured-content-slider.component';
import { BookCardComponent } from '../../components/book-card/book-card.component'; 
import { Book } from '../../models/book.model'; 

@Component({
  selector: 'app-starter',
  imports: [
    CommonModule,
    MaterialModule, 
    FeaturedContentSliderComponent,
    BookCardComponent 
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit { 
         
  novedadesLibros: Book[] = [];
  masVendidosLibros: Book[] = [];

  constructor() { } 

  ngOnInit(): void {
    this.novedadesLibros = [
      { id: '101', title: 'El Misterio del Tiempo Perdido', author: 'Elena Autora', price: 19.99, coverImageUrl: 'assets/images/covers/cover1.jpg', currency: 'EUR' },
      { id: '102', title: 'Crónicas de un Futuro Imaginado', author: 'Marcos Escritor', price: 22.50, coverImageUrl: 'assets/images/covers/cover2.jpg', currency: 'EUR' },
      { id: '103', title: 'Recetas para el Alma Curiosa', author: 'Sofía Chef', price: 15.75, coverImageUrl: 'assets/images/covers/cover3.jpg', currency: 'EUR' },
      { id: '104', title: 'Aventuras en la Montaña Nublada', author: 'Carlos Viajero', price: 18.00, coverImageUrl: 'assets/images/covers/cover1.jpg', currency: 'EUR' },
    ];

    this.masVendidosLibros = [
      { id: '201', title: 'El Secreto Mejor Guardado', author: 'Laura BestSeller', price: 25.00, coverImageUrl: 'assets/images/covers/cover2.jpg', currency: 'EUR' },
      { id: '202', title: 'La Red Invisible que Nos Une', author: 'Pedro Popular', price: 20.99, coverImageUrl: 'assets/images/covers/cover3.jpg', currency: 'EUR' },
      { id: '203', title: 'Guía Práctica para Soñadores', author: 'Ana Soñadora', price: 17.50, coverImageUrl: 'assets/images/covers/cover1.jpg', currency: 'EUR' },
      { id: '204', title: 'El Jardín de las Palabras Olvidadas', author: 'Luis Lector', price: 21.20, coverImageUrl: 'assets/images/covers/cover2.jpg', currency: 'EUR' },
    ];
  }
}