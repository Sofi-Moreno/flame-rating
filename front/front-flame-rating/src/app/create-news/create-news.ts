// src/app/create-news/create-news.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { News } from '../model/news';
import { NewsService } from '../service/news-service';

@Component({
  selector: 'app-create-news',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './create-news.html',
  styleUrls: ['./create-news.css']
})
export class CreateNewsComponent {

  public news: News = new News();
  
  // Estados para el diagrama de flujo
  public isPreviewing: boolean = false; 
  public showSuccessModal: boolean = false; 
  public errorMessage: string = '';

  constructor(
    private newsService: NewsService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  // --- PASO 1: Revisar (Validación) ---
  onReview() {
    this.errorMessage = '';
    this.isPreviewing = true; 
  }

  // --- PASO 2A: Modificar ---
  onModify() {
    this.isPreviewing = false; 
  }

  // --- PASO 2B: Eliminar/Descartar ---
  onDiscard() {
    if(confirm("¿Estás seguro de que deseas eliminar la noticia redactada?")) {
      this.goBack(); 
    }
  }

  // --- PASO 2C: Publicar ---
  onPublish() {
    // 1. LIMPIEZA DE DATOS: Quitamos espacios en blanco accidentales en las URLs
    if (this.news.urlImages) {
      this.news.urlImages = this.news.urlImages.replace(/\s/g, ''); 
    }
    if (this.news.urlVideo) {
      this.news.urlVideo = this.news.urlVideo.replace(/\s/g, ''); 
    }

    // 2. SEGURIDAD: Forzamos que el ID sea null para crear una nueva entrada
    // @ts-ignore
    this.news.id = null; 

    // 3. Enviar al backend
    this.newsService.createNews(this.news).subscribe(
      (createdNews) => {
        this.showSuccessModal = true;
      },
      (error) => {
        console.error('Error al crear la noticia:', error);
        this.errorMessage = 'Ocurrió un error al publicar. Verifica que las URLs no sean demasiado largas.';
        // Nos quedamos en el preview para que el usuario pueda intentar arreglarlo
      }
    );
  }

  // --- PASO 3: Post-Publicación ---
  
  createAnother() {
    this.news = new News(); // Reiniciar formulario
    this.isPreviewing = false;
    this.showSuccessModal = false;
    this.errorMessage = '';
  }

  finish() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/view-news']); 
  }

  // --- Funciones para la Vista Previa ---
  
  getImagesArray(): string[] {
    if (this.news.urlImages) {
      // Divide por comas y limpia espacios para la vista previa
      return this.news.urlImages.split(',').map(u => u.trim()).filter(u => u.length > 0);
    }
    return [];
  }

  getVideosArray(): string[] {
    if (this.news.urlVideo) {
      return this.news.urlVideo.split(',').map(u => u.trim()).filter(u => u.length > 0);
    }
    return [];
  }

  // Detecta si es YouTube para mostrar iframe o video normal en la preview
  isYoutube(url: string): boolean {
    return url.includes('youtube.com/watch') || url.includes('youtu.be');
  }

  // Sanitiza la URL de YouTube para el iframe
  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1];
      }
      const embedUrl = 'https://www.youtube.com/embed/' + videoId;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch (e) {
      return ''; // Retorna vacío si la URL es inválida
    }
  }
}