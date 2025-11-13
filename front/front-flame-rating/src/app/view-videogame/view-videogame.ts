import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; 
import { VideoGameService } from '../service/video-game-service';
import { ActivatedRoute } from '@angular/router';
import { VideoGame } from '../model/video-game';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Review } from '../model/review';
import { ReviewService } from '../service/review-service';

export interface GameImage {
  thumbnailSrc: string; // La imagen pequeña
  largeSrc: string;     // La imagen grande
  alt: string;
}

@Component({
  selector: 'app-view-videogame',
  imports: [
    CommonModule
  ],
  templateUrl: './view-videogame.html',
  styleUrl: './view-videogame.css',
})
export class ViewVideogame implements OnInit{

  // --- Propiedades Originales ---
  videoGame: VideoGame | null = null;
  currentBigMediaUrl: SafeResourceUrl | string | null = null;
  isTrailerActive: boolean = true;
  safeVideoUrl: SafeResourceUrl | null = null;
  mainImageSrc: string | null = null;
  selectedMediaUrl: string | SafeResourceUrl = '';
  imageList: GameImage[] = [];

  // --- Propiedades para los fueguitos ---
  public selectedRating: number = 0; 
  public hoveredRating: number = 0;  

  // --- ¡NUEVA PROPIEDAD! Para encontrar el contenedor de partículas ---
  // Busca el #particleContainer en el HTML
  @ViewChild('particleContainer') particleContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private gameService: VideoGameService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.gameService.findById(id).subscribe(game => {
          if (game) {
            
            // --- ¡CAMBIO AQUÍ! ---
            // Usamos la nueva función para "traducir" la URL
            const embedUrl = this.convertYoutubeUrlToEmbed(game.urlTrailer);
            this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
            
            // Guardamos la URL "traducida" para marcarla como activa
            this.selectedMediaUrl = embedUrl; 
            
            if (game.urlImages && typeof game.urlImages === 'string') {
              const urlArray = (game.urlImages as string)
                .split(',')
                .map(url => url.trim()); 
              this.imageList = urlArray.map((url, index) => {
                return {
                  largeSrc: url,     
                  thumbnailSrc: url, 
                  alt: `Imagen de galería ${index + 1}` 
                };
              });
            }

            if (game.platform && typeof game.platform === 'string') {
              game.platform = (game.platform as string)
                                .split(',')
                                .map(p => p.trim());
            }

            if (game.genre && typeof game.genre === 'string') {
              game.genre = (game.genre as string)
                                .split(',')
                                .map(c => c.trim());
            }
            this.reviewService.findByVideoGameId(game.id).subscribe(reviews => {
              game.reviews = reviews;
            });
          }
          this.videoGame = game;
          console.log('Juego y reviews cargados:', this.videoGame);
          console.log('Arreglo de reviews:', this.videoGame.reviews);
        });
      }
    });
  }

  // --- Funciones de Clic (Originales) ---

  selectTrailer(): void {
    const trailerRaw = this.videoGame?.urlTrailer ?? '';
    
    // --- ¡CAMBIO AQUÍ! ---
    // Usamos la nueva función para "traducir" la URL
    const embedUrl = this.convertYoutubeUrlToEmbed(trailerRaw);
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    
    this.mainImageSrc = null; 
    
    // Marcamos esta miniatura como activa
    this.selectedMediaUrl = embedUrl;
  }

  selectImage(image: GameImage): void {
    this.mainImageSrc = image.largeSrc;
    this.safeVideoUrl = null; 
    this.selectedMediaUrl = image.thumbnailSrc; 
  }

  // --- Funciones para los fueguitos ---

  public rate(rating: number): void {
    if (this.selectedRating === rating) {
      this.selectedRating = 0;
    } else {
      this.selectedRating = rating;
      
      if (this.selectedRating > 0) {
        this.triggerParticleEffect();
      }
    }
    this.guardarCalificacionEnBaseDeDatos(this.selectedRating);
  }

  public handleMouseOver(rating: number): void {
    this.hoveredRating = rating;
  }

  public handleMouseLeave(): void {
    this.hoveredRating = 0; 
  }

  private guardarCalificacionEnBaseDeDatos(ratingAGuardar: number): void {
    if (!this.videoGame) return; 
    
    console.log(`--- Función que usaré en un futuro para calificar un juego por rating ---`);
    console.log(`Juego ID: ${this.videoGame.id}`);
    console.log(`Rating seleccionado: ${ratingAGuardar}`);
  }

  private triggerParticleEffect(): void {
    const container = this.particleContainer.nativeElement;
    container.innerHTML = ''; // Limpia partículas viejas

    for (let i = 0; i < 5; i++) { // Creamos 5 partículas
      const particle = document.createElement('img');
      particle.src = '/flame-rating-images/flame-icon-interaction.png';
      particle.classList.add('flame-particle');

      // --- ¡CAMBIOS PARA LA "LLUVIA"! ---
      
      // 1. Posición horizontal aleatoria
      const x = Math.random() * 100; // 0% a 100% del ancho
      particle.style.left = `${x}%`;

      // 2. Empieza desde arriba (top: 0)
      particle.style.top = '0px'; 

      // 3. Retraso aleatorio
      const delay = Math.random() * 0.2; // 0s a 0.2s
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);

      // 4. Borra la partícula después de 2 segundos (como pediste)
      setTimeout(() => {
        particle.remove();
      }, 2000);
    }
  }

  // --- ------------------------------------------------- ---
  // --- ¡NUEVA FUNCIÓN HELPER! Para las llamas de reseña  ---
  // --- ------------------------------------------------- ---

  /**
   * Crea un array vacío del tamaño 'n' para que *ngFor pueda iterar.
   * Maneja 'null' o 'undefined' de forma segura.
   * @param n El número del rating (ej: 3)
   * @returns Un array (ej: [undefined, undefined, undefined])
   */
  public createArrayFromNumber(n: number | undefined | null): any[] {
    if (!n) {
      return []; // Devuelve un array vacío si no hay rating
    }
    // Redondea por si el rating es decimal (ej: 4.5)
    const intRating = Math.round(n); 
    // Crea un array con 'intRating' posiciones
    return new Array(intRating);
  }

  // --- ------------------------------------------------- ---
  // --- ¡NUEVA FUNCIÓN HELPER! Para "traducir" links de YouTube ---
  // --- ------------------------------------------------- ---
  
  /**
   * Convierte una URL normal de YouTube (watch?v= o youtu.be) 
   * en una URL de "embed" para el <iframe>.
   * @param url La URL original del video.
   * @returns La URL de "embed" lista para el <iframe>.
   */
  private convertYoutubeUrlToEmbed(url: string | undefined | null): string {
    if (!url) {
      return ''; // Devuelve vacío si no hay URL
    }

    let videoId = '';

    try {
      // Caso 1: URL normal (https://www.youtube.com/watch?v=VIDEO_ID)
      if (url.includes('watch?v=')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } 
      // Caso 2: URL corta (https://youtu.be/VIDEO_ID)
      else if (url.includes('youtu.be/')) {
        videoId = new URL(url).pathname.substring(1);
      }
      // Caso 3: Ya es una URL de "embed" (no hacer nada)
      else if (url.includes('/embed/')) {
        return url;
      }

      if (videoId) {
        // Devuelve la URL de embed con autoplay y mute
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      }
    } catch (e) {
      console.error('Error al parsear la URL de YouTube:', e);
      return url; // Devuelve la URL original si falla
    }
    
    // Si no se pudo "traducir", devuelve la URL original
    return url;
  }

}