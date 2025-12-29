import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; 
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

  // --- FUNCIÓN DE VALIDACIÓN MEJORADA ---
  onReview() {
    
    // 1. VALIDACIÓN DE IMÁGENES
    if (this.news.urlImages && this.news.urlImages.trim().length > 0) {
      // A. Quitamos espacios en blanco
      this.news.urlImages = this.news.urlImages.replace(/\s/g, '');
      
      // B. Separamos por comas para revisar una por una
      const images = this.news.urlImages.split(',');

      for (const img of images) {
        // Verificamos que sea una URL válida (empieza con http o https)
        // Nota: No validamos extensión (.jpg) porque a veces usas picsum.photos u otros servicios
        if (!img.toLowerCase().startsWith('http')) {
          alert(`Error en imagen: "${img}" no parece una URL válida (debe empezar con http).`);
          return; // DETENEMOS LA EJECUCIÓN AQUÍ
        }
      }
    }

    // 2. VALIDACIÓN DE VIDEOS (YOUTUBE)
    if (this.news.urlVideo && this.news.urlVideo.trim().length > 0) {
      // A. Quitamos espacios
      this.news.urlVideo = this.news.urlVideo.replace(/\s/g, '');
      
      // B. Separamos por comas
      const videos = this.news.urlVideo.split(',');

      for (const vid of videos) {
        // C. Verificamos que sea de YouTube
        const isYoutube = vid.includes('youtube.com') || vid.includes('youtu.be');
        
        if (!isYoutube) {
          alert(`Error en video: "${vid}" no es un enlace de YouTube válido.`);
          return; // DETENEMOS LA EJECUCIÓN AQUÍ
        }
      }
    }

    // 3. Si todo está correcto, pasamos a la vista previa
    this.isPreview = true;
  }

  onEdit() {
    this.isPreview = false;
  }

  onUpdate() {
    this.news.id = this.id; // Aseguramos el ID

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
}