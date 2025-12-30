import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router'; // IMPORTANTE: Agregado para el botón de editar

import { News } from '../model/news';
import { NewsService } from '../service/news-service';
import { DeleteNewsComponent } from '../delete-news/delete-news'; 
import { AuthService } from '../service/auth'; 
import { User } from '../model/user';         

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    DeleteNewsComponent,
    RouterLink // IMPORTANTE: Agregado aquí
  ],
  templateUrl: './view-news.html',
  styleUrls: ['./view-news.css'],
})
export class ViewNews implements OnInit {
  
  private authService = inject(AuthService);
  private newsService = inject(NewsService);
  private sanitizer = inject(DomSanitizer);

  public newsList: News[] = [];
  public isLoading: boolean = true; 

  public showDeleteModal: boolean = false;
  public selectedNewsId: number | null = null;
  public selectedNewsTitle: string = '';

  currentUser$: Observable<User | null> = this.authService.currentUser;
  public isAdmin: boolean = false; 

  constructor() { }

  ngOnInit(): void {
    this.loadNews();
    
    this.currentUser$.subscribe(user => {
      this.isAdmin = user ? user.isAdmin : false; 
    });
  }

  loadNews(): void {
    this.isLoading = true; 
    
    this.newsService.getNews().subscribe(
      (data) => {
        this.newsList = data.sort((a, b) => {
          const dateA = new Date(a.publicationDate).getTime();
          const dateB = new Date(b.publicationDate).getTime();
          if (dateA !== dateB) return dateB - dateA; 
          return b.id! - a.id!; 
        });
        this.isLoading = false; 
      },
      (error) => {
        console.error('Error al cargar las noticias:', error);
        this.isLoading = false; 
      }
    );
  }

  openDeleteModal(news: News): void {
    if (news.id) {
      this.selectedNewsId = news.id;
      this.selectedNewsTitle = news.title;
      this.showDeleteModal = true;
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedNewsId = null;
    this.selectedNewsTitle = '';
  }

  handleDeleteConfirmed(id: number): void {
    this.newsService.deleteNews(id).subscribe(
      () => {
        this.newsList = this.newsList.filter(n => n.id !== id);
        this.closeDeleteModal();
      },
      (error) => {
        console.error('Error al eliminar:', error);
        alert('Ocurrió un error al intentar eliminar la noticia.');
      }
    );
  }
  
  getImages(news: News): string[] {
    if (news.urlImages) return news.urlImages.split(',').map(u => u.trim()).filter(u => u.length > 0);
    return [];
  }

  getVideos(news: News): string[] {
    if (news.urlVideo) return news.urlVideo.split(',').map(u => u.trim()).filter(u => u.length > 0);
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
    carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
  }

  scrollRight(carousel: HTMLElement) {
    carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
  }
}