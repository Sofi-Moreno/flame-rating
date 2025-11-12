// src/app/create-news/create-news.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { News } from '../model/news';
import { NewsService } from '../service/news-service';
import { FormsModule } from '@angular/forms'; // <-- ¡IMPORTANTE! Para [(ngModel)]
import { CommonModule } from '@angular/common'; // <-- Para *ngIf

@Component({
  selector: 'app-create-news',
  standalone: true,
  imports: [
    FormsModule,    // <-- ¡Añadir aquí!
    CommonModule    // <-- ¡Añadir aquí!
  ],
  templateUrl: './create-news.html',
  styleUrls: ['./create-news.css']
})
export class CreateNewsComponent {

  // Creamos un objeto "News" vacío que se rellenará con el formulario
  public news: News = new News();
  public successMessage: string = '';
  public errorMessage: string = '';

  constructor(
    private newsService: NewsService,
    private router: Router // Inyectamos el Router
  ) { }

  // Esta función se llama cuando el formulario se envía
  onSubmit() {
    // Reseteamos mensajes
    this.successMessage = '';
    this.errorMessage = '';

    // Llamamos al servicio con la noticia del formulario
    this.newsService.createNews(this.news).subscribe(
      (createdNews) => {
        // ¡Éxito!
        this.successMessage = `Noticia "${createdNews.title}" creada con éxito.`;

        // Opcional: limpiar el formulario
        this.news = new News();

        // Opcional: Redirigir al usuario a la lista de noticias después de 2 seg
        setTimeout(() => {
          this.router.navigate(['/news']); // Asegúrate que '/news' es tu ruta de ver noticias
        }, 2000);
      },
      (error) => {
        // Error
        console.error('Error al crear la noticia:', error);
        this.errorMessage = 'Error al crear la noticia. Revisa los campos o la conexión.';
      }
    );
  }

  // Función simple para volver
  goBack() {
    this.router.navigate(['/news']); // Cambia '/news' si tu ruta es otra
  }
}
