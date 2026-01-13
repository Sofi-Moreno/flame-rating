import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; 
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser'; // Importamos SafeUrl

import { NewsService } from '../service/news-service';
import { News } from '../model/news';

@Component({
  selector: 'app-update-news',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './update-news.html',
  styleUrls: ['./update-news.css']
})
export class UpdateNewsComponent implements OnInit {

  private newsService = inject(NewsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  public news: News = new News(); 
  public id: number = 0;
  
  public isPreview: boolean = false;
  public showSuccessModal: boolean = false;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);
    
    if(this.id){
      this.newsService.findById(this.id).subscribe(
        (data) => {
          this.news = data; 
        },
        (error) => {
          console.error("Error al cargar noticia:", error);
          this.router.navigate(['/view-news']); 
        }
      );
    }
  }

  // --- VALIDACIÓN ---
  onReview() {
    // 1. Limpiar espacios extras en imágenes
    if (this.news.urlImages && this.news.urlImages.trim().length > 0) {
      // Separamos por coma y limpiamos espacios de cada URL individualmente
      // Esto es más seguro que un replace global
      this.news.urlImages = this.news.urlImages
        .split(',')
        .map(url => url.trim()) // Quitamos espacios al inicio y final
        .join(',');
    }

    // 2. Limpiar espacios en videos
    if (this.news.urlVideo && this.news.urlVideo.trim().length > 0) {
      this.news.urlVideo = this.news.urlVideo.replace(/\s/g, '');
    }
    
    // Pasamos a vista previa (Permitimos pasar aunque haya links raros para probarlos)
    this.isPreview = true;
  }

  onEdit() {
    this.isPreview = false;
  }

  onUpdate() {
    this.news.id = this.id; 

    this.newsService.updateNews(this.news).subscribe(
      (data) => {
        this.showSuccessModal = true;
      },
      (error) => {
        console.error("Error al actualizar:", error);
        alert("Hubo un error al guardar los cambios.");
      }
    );
  }

  finish() {
    this.router.navigate(['/view-news']);
  }

  // --- MANEJO DE IMÁGENES Y VIDEOS BLINDADO ---

  getImages(): SafeUrl[] {
    if (!this.news.urlImages) return [];
    
    const urls = this.news.urlImages.split(',').filter(url => url.length > 0);
    
    // Sanitizamos cada URL para que Angular no bloquee nada
    return urls.map(url => this.sanitizer.bypassSecurityTrustUrl(url));
  }

  getVideos(): string[] {
    if (!this.news.urlVideo) return [];
    return this.news.urlVideo.split(',').filter(url => url.length > 0);
  }

  isYoutube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';
    try {
      if (url.includes('youtube.com/watch')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1];
      }
    } catch (e) {
      console.error("Error parseando URL de YouTube", e);
    }
    const embedUrl = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  // --- SOLUCIÓN MAESTRA PARA IMÁGENES ROTAS ---
  handleImgError(event: any) {
    console.warn("La imagen falló al cargar, poniendo fallback.");
    // Reemplaza la imagen rota por una imagen genérica que SIEMPRE funciona
    event.target.src = 'https://placehold.co/600x400?text=Imagen+No+Disponible';
    // Nos aseguramos que sea visible
    event.target.style.display = 'block';
  }
}