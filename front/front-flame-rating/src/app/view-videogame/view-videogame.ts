import { Component, OnInit, ViewChild, ElementRef, inject} from '@angular/core'; 
import { VideoGameService } from '../service/video-game-service';
import { ActivatedRoute } from '@angular/router';
import { VideoGame } from '../model/video-game';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Review } from '../model/review';
import { ReviewService } from '../service/review-service';
import { CreateReview } from '../create-review/create-review';
import { DeleteVideoGame } from '../delete-video-game/delete-video-game';
import { DeleteReview } from '../delete-review/delete-review';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth'; 
import { User } from '../model/user'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UpdateReview } from '../update-review/update-review';

export interface GameImage {
  thumbnailSrc: string; // La imagen pequeña
  largeSrc: string;     // La imagen grande
  alt: string;
}

@Component({
  selector: 'app-view-videogame',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateReview,
    DeleteVideoGame,
    DeleteReview,
    UpdateReview
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
  private readonly SERVER_URL = 'http://localhost:8080';

  public selectedRating: number = 0; 
  public hoveredRating: number = 0;  
  public showReviewModal: boolean = false;
  public updateMode: boolean = false;
  public deleteMode: boolean = false;
  public reviewDelete: boolean = false;
  public reviewUpdate: boolean = false;

  @ViewChild('particleContainer') particleContainer!: ElementRef;
   public isAdmin: boolean = false;

   // --- observable del usuario actual ---
   private authService = inject(AuthService);
  
  // Observable que rastrea el estado del usuario.
  currentUser$: Observable<User | null> = this.authService.currentUser;
  public currentUserName: string = 'Invitado';
  public selectedReviewId: number | null = null;
  public selectedReviewComment?: string = '';
  public selectedReviewRating?: number;
  public currentUser?: string;
  
  // Variables que el HTML utiliza (se actualizan en ngOnInit)
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: VideoGameService,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer,
    private router: Router
    ) { }

  ngOnInit(): void {
    // Suscripción reactiva: se actualiza cada vez que el estado del usuario cambia (login/logout)
    this.currentUser$.subscribe(user => {
      // Si 'user' tiene un valor (no es null), isLoggedIn es true.
      this.isLoggedIn = !!user; 
      // Si 'user' tiene un valor, usa user.isAdmin; de lo contrario, es false.
      this.isAdmin = user ? user.isAdmin : false; 
    });

    this.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user; 
      this.isAdmin = user ? user.isAdmin : false; 
      // Guardamos el nombre para pasárselo a la review
      this.currentUserName = user ? user.username : 'Usuario Anónimo';
    });
    
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
            
            if (game.urlImages) {
              this.imageList = game.urlImages
                  .split(',')
                  .map((c: string) => c.trim())
                  .map((relativePath: string) => {
                      // ⬇️ CONCATENACIÓN CLAVE: Agrega la URL del servidor ⬇️
                      const fullUrl = this.SERVER_URL + relativePath; 
                      return {
                          thumbnailSrc: fullUrl,
                          largeSrc: fullUrl,
                          alt: 'Imagen de videojuego'
                      } as GameImage;
                  });

              // Inicializar la imagen principal (si existe)
              if (this.imageList.length > 0) {
                  this.mainImageSrc = this.imageList[0].largeSrc;
              }
          } else {
              this.imageList = [];
              this.mainImageSrc = null;
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

  /**
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

  rateAndOpenModal(rating: number): void {
    // 1. Guarda la puntuación seleccionada
    this.selectedRating = rating;
    
    // 2. Abre la ventana modal
    this.showReviewModal = true;
  }

  openReviewModal(): void {
    if (this.videoGame) {
      this.showReviewModal = true;
    }
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
  }

  reviewSaved(): void {
    console.log('Comentario guardado. Recargando reviews...');
    if (this.videoGame) {
      this.reviewService.findByVideoGameId(this.videoGame.id).subscribe(reviews => {
        this.videoGame!.reviews = reviews;
        this.actualizarPromedioRating(); // Actualiza el promedio de estrellas
        // CERRAR EL MODAL después de recargar (Flujo solicitado)
        this.closeReviewModal();
        
        // Feedback visual con SweetAlert (ya que lo usas en delete)
        Swal.fire({
          icon: 'success',
          title: 'Reseña publicada',
          text: 'Tu comentario ha sido agregado con éxito.',
          timer: 2000,
          showConfirmButton: false
        });
      });
    }
  }

  updateGame(): void {
    if (this.videoGame) {
      this.router.navigate(['/update-videogame', this.videoGame.id]);
    }
  }

  openDeleteModal(): void {
    if (this.videoGame) {
      this.deleteMode = true;
    }
  }

  closeDeleteModal(): void {
    this.deleteMode = false;
  }

  onConfirmDelete(id: number): void {
    this.gameService.deleteVideoGame(id).subscribe({
      next: () => {
        Swal.fire({
            icon: 'success',
            title: 'Videojuego eliminado',
            text: 'El videojuego ha sido eliminado con éxito.',
            timer: 2000,
            showConfirmButton: false
        });

        this.deleteMode = false;
        this.router.navigate(['']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el videojuego',
        });
      }
    });
  }

  openDeleteReviewModal(id: number): void {
    this.selectedReviewId = id; // Guardamos el ID de la reseña clickeada
    this.reviewDelete = true;
  }

  closeDeleteReviewModal(): void {
    this.reviewDelete = false;
    this.selectedReviewId = null;
  }

  onConfirmReviewDelete(id: number): void {
    console.log('Eliminando reseña con ID:', id);
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.closeDeleteReviewModal();
        if (this.videoGame) {
          this.reviewService.findByVideoGameId(this.videoGame.id).subscribe(reviews => {
            this.videoGame!.reviews = reviews;
            this.actualizarPromedioRating();
          });
        }
        // Feedback visual con SweetAlert (ya que lo usas en delete)
          Swal.fire({
            icon: 'success',
            title: 'Reseña eliminada',
            text: 'El comentario ha sido eliminado con éxito.',
            timer: 2000,
            showConfirmButton: false
          });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reseña',
        });
      }
    });
  }

  private refreshGameData(): void {
    if (this.videoGame) {
      this.gameService.findById(this.videoGame.id).subscribe(game => {
        if (game) this.videoGame!.averageRating = game.averageRating;
      });
    }
  }

  openUpdateReviewModal(id: number): void {
    this.selectedReviewId = id;
    this.reviewService.findById(id).subscribe((review: Review) => {
        this.selectedReviewComment = review.comment;
        this.selectedReviewRating = review.rating;
        this.currentUser = review.userName;
        this.reviewUpdate = true;
    });
  }

  closeUpdateReviewModal(): void {
    this.reviewUpdate = false;
    this.selectedReviewComment = "";
    this.selectedReviewId = null;
  }

  onConfirmReviewUpdate(): void {
    this.closeUpdateReviewModal();
    if (this.videoGame) {
      // Recargamos las reseñas para ver los cambios
      this.reviewService.findByVideoGameId(this.videoGame.id).subscribe(reviews => {
        this.videoGame!.reviews = reviews;
        this.actualizarPromedioRating();
      });
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Reseña actualizada',
      text: 'Tu comentario ha sido modificado con éxito.',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Dentro de la clase ViewVideogame

private actualizarPromedioRating(): void {
  if (!this.videoGame || !this.videoGame.reviews || this.videoGame.reviews.length === 0) {
    if (this.videoGame) {
      this.videoGame.averageRating = 0;
      // Opcional: Llamar al servicio para poner el rating en 0 en la BD
      this.enviarPromedioABaseDeDatos(0);
    }
    return;
  }

  // 1. Sumar todos los ratings
  const totalSuma = this.videoGame.reviews.reduce((acc: any, review: { rating: any; }) => acc + (review.rating || 0), 0);

  // 2. Calcular el promedio (con un decimal)
  const promedio = parseFloat((totalSuma / this.videoGame.reviews.length).toFixed(1));

  // 3. Modificar en el objeto local (esto actualiza el HTML automáticamente)
  this.videoGame.averageRating = promedio;


  // 4. Modificar en la Base de Datos
  this.enviarPromedioABaseDeDatos(promedio);
}

private enviarPromedioABaseDeDatos(nuevoPromedio: number): void {
  if (this.videoGame) {
    // Asumiendo que tu VideoGameService tiene un método para actualizar
    // Si no existe, deberás crearlo en tu service.
    this.gameService.updateAverageRating(this.videoGame.id, nuevoPromedio).subscribe({
      next: () => console.log('Promedio actualizado en BD:', nuevoPromedio),
      error: (err: any) => console.error('Error al actualizar promedio en BD', err)
    });
  }
}

  handleReviewClick(): void {
    if (this.isLoggedIn) {
      this.openReviewModal(); 
    } else {
      // AQUÍ ESTÁ LA MAGIA:
      // queryParams envía un dato extra en la URL tipo: /login-register?returnUrl=/videogame/5
      this.router.navigate(['/login-register'], { queryParams: { returnUrl: this.router.url } });
    }
  }
}