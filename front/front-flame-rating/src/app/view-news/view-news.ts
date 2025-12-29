import { Component, OnInit, inject } from '@angular/core'; // Agregamos inject
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs'; // Importamos Observable

// Importamos tus modelos y servicios de autenticación
import { News } from '../model/news';
import { NewsService } from '../service/news-service';
import { DeleteNewsComponent } from '../delete-news/delete-news'; 
import { AuthService } from '../service/auth'; // Asegúrate que la ruta sea correcta
import { User } from '../model/user';          // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    DeleteNewsComponent
  ],
  templateUrl: './view-news.html',
  styleUrls: ['./view-news.css'],
})
export class ViewNews implements OnInit {
  
  // --- INYECCIÓN DE DEPENDENCIAS (Estilo Moderno) ---
  private authService = inject(AuthService);
  private newsService = inject(NewsService); // Convertí este también a inject para consistencia
  private sanitizer = inject(DomSanitizer);  // Convertí este también a inject para consistencia

  // --- VARIABLES DE DATOS ---
  public newsList: News[] = [];
  public isLoading: boolean = true; 

  // --- VARIABLES DEL MODAL ---
  public showDeleteModal: boolean = false;
  public selectedNewsId: number | null = null;
  public selectedNewsTitle: string = '';

  // --- ESTADO DEL USUARIO (Reactivo) ---
  // Observable que rastrea el estado (Igual que en tu Header)
  currentUser$: Observable<User | null> = this.authService.currentUser;
  
  // Variable que controla el HTML (se actualiza en ngOnInit)
  public isAdmin: boolean = false; 

  constructor() { 
    // El constructor queda vacío porque usamos inject() arriba.
    // Es más limpio y sigue el estilo de tu Header.
  }

  ngOnInit(): void {
    // 1. Cargar las noticias
    this.loadNews();
    
    // 2. SUSCRIPCIÓN REACTIVA (Igual que en tu Header)
    // Cada vez que el usuario cambia (login/logout), esto se ejecuta
    this.currentUser$.subscribe(user => {
      // Si existe usuario, usamos su propiedad isAdmin. Si no, es false.
      this.isAdmin = user ? user.isAdmin : false; 
      
      // Opcional: Console log para depurar si lo necesitas
      // console.log("Usuario actual:", user, "Es admin:", this.isAdmin);
    });
  }

  // --- CARGAR NOTICIAS ---
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

  // --- ELIMINAR NOTICIA ---
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
  
  // --- UTILIDADES DE IMAGEN/VIDEO ---
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