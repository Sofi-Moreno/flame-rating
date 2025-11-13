// src/app/news-view/view-news.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { News } from '../model/news';
import { NewsService } from '../service/news-service';

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './view-news.html',
  styleUrls: ['./view-news.css'],
})
export class ViewNews implements OnInit {
  
  public newsList: News[] = [];
  public isLoading: boolean = true; 

  constructor(
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.isLoading = true; 
    
    this.newsService.getNews().subscribe(
      (data) => {
        // --- AQUÍ ESTÁ LA MAGIA DEL ORDENAMIENTO EN EL FRONTEND ---
        this.newsList = data.sort((a, b) => {
          // 1. Convertimos las fechas a milisegundos para comparar
          const dateA = new Date(a.publicationDate).getTime();
          const dateB = new Date(b.publicationDate).getTime();

          // 2. Comparamos fechas (Descendente: la más nueva primero)
          if (dateA !== dateB) {
            return dateB - dateA; 
          }

          // 3. Si las fechas son IGUALES, desempatamos por ID (Descendente)
          return b.id! - a.id!; 
        });
        // ----------------------------------------------------------

        this.isLoading = false; 
      },
      (error) => {
        console.error('Error al cargar las noticias:', error);
        this.isLoading = false; 
      }
    );
  }
  
  // --- Funciones originales (sin cambios) ---

  getImages(news: News): string[] {
    if (news.urlImages) {
      return news.urlImages.split(',')
                           .map(url => url.trim())
                           .filter(url => url.length > 0);
    }
    return [];
  }

  getVideos(news: News): string[] {
    if (news.urlVideo) {
      return news.urlVideo.split(',')
                          .map(url => url.trim())
                          .filter(url => url.length > 0);
    }
    return [];
  }

  isYoutube(url: string): boolean {
    return url.includes('youtube.com/watch') || url.includes('youtu.be');
  }

  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';

    if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    }

    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  handleMediaError(event: Event) {
    const element = event.target as HTMLElement;
    element.style.display = 'none';
  }

  scrollLeft(carousel: HTMLElement) {
    carousel.scrollBy({
      left: -carousel.clientWidth,
      behavior: 'smooth'
    });
  }

  scrollRight(carousel: HTMLElement) {
    carousel.scrollBy({
      left: carousel.clientWidth,
      behavior: 'smooth'
    });
  }
}