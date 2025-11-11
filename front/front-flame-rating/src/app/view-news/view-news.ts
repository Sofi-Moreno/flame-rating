// src/app/news-view/view-news.ts

import { Component, OnInit } from '@angular/core';
import { News } from '../model/news';
import { NewsService } from '../service/news-service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// ¡NUEVAS IMPORTACIONES!
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  
  // ¡ACTUALIZADO! Inyectamos el DomSanitizer
  constructor(
    private newsService: NewsService,
    private sanitizer: DomSanitizer 
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getNews().subscribe(
      (data) => {
        this.newsList = data;
      },
      (error) => {
        console.error('Error al cargar las noticias:', error);
      }
    );
  }

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

  // --- ¡NUEVAS FUNCIONES PARA YOUTUBE! ---

  /**
   * Revisa si una URL es de YouTube.
   */
  isYoutube(url: string): boolean {
    return url.includes('youtube.com/watch') || url.includes('youtu.be');
  }

  /**
   * Convierte una URL de YouTube (watch?v=ID) a una URL de "embed"
   * y la marca como segura para que Angular la use en un <iframe>.
   */
  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';

    if (url.includes('youtube.com/watch')) {
      // Extrae el ID de: https://www.youtube.com/watch?v=VIDEO_ID
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be')) {
      // Extrae el ID de: https://youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1];
    }

    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    
    // Usamos el sanitizer para decirle a Angular que esta URL es segura
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}