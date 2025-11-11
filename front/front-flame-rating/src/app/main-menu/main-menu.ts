import { Component, OnInit } from '@angular/core';
import { VideoGame } from '../model/video-game';
import { VideoGameService } from '../service/video-game-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
  imports: [
    RouterLink
  ],
})
export class MainMenu implements OnInit {
  // --- Propiedades existentes ---
  videoGames: {[key: string]: VideoGame[]} = {};
  categorys: string[] = ["Un Jugador","Multijugador","En linea"];

  // --- NUEVA PROPIEDAD para la lógica de arrastre ---
  // Usamos un Map para guardar el estado de CADA carrusel por separado
  private carouselState = new Map<HTMLElement, {
    isDown: boolean;
    startX: number;
    scrollLeft: number;
  }>();

  // --- Constructor existente ---
  constructor(
    private videoGameService: VideoGameService
  ) {}

  // --- ngOnInit existente ---
  ngOnInit(): void {
    this.videoGameService.getVideoGames().subscribe((data: VideoGame[]) => {
      // Si cada juego puede traer urlImages como string, convertirlo a array por juego
      data.forEach(game => {
        if ((game as any).urlImages && typeof (game as any).urlImages === 'string') {
          (game as any).urlImages = ((game as any).urlImages as string)
                                  .split(',')
                                  .map((url: string) => url.trim()); // .trim() quita espacios extra
        }
      });

      this.videoGames = this.organizeByCategory(data);

      console.log('Datos de juegos recibidos:', this.videoGames);
    });
  }
  
  // --- organizeByCategory existente ---
  private organizeByCategory(videoGames: VideoGame[]): {[key: string]: VideoGame[]} {
    const categorizedGames: {[key: string]: VideoGame[]} = {};
    for (const game of videoGames) {
      if (!categorizedGames[game.category]) {
        categorizedGames[game.category] = [];
      }
      categorizedGames[game.category].push(game);
    }
    return categorizedGames;
  }

  // --- getPlatformsArray existente ---
  public getPlatformsArray(platformsString: string | undefined | null): string[] {
    // Verificación para evitar errores si la propiedad es nula o vacía
    if (!platformsString) {
      return [];
    }
    return platformsString.split(',').map(plataforma => plataforma.trim());
  }

  // --- ------------------------------------ ---
  // --- NUEVOS MÉTODOS para la lógica de arrastre ---
  // --- ------------------------------------ ---

  public onMouseDown(e: MouseEvent, carousel: HTMLElement): void {
    // Previene el comportamiento por defecto (como arrastrar la imagen)
    e.preventDefault(); 
    
    // Guarda el estado: SÍ está haciendo clic
    this.carouselState.set(carousel, {
      isDown: true,
      startX: e.pageX - carousel.offsetLeft,
      scrollLeft: carousel.scrollLeft,
    });
    // Añadimos una clase al <body> para que el cursor :grabbing se mantenga
    // aunque el mouse se salga del <ul> mientras arrastra
    document.body.classList.add('grabbing');
  }

  public onMouseLeave(carousel: HTMLElement): void {
    // Si el mouse se sale del carrusel, deja de arrastrar
    // (Solo si estábamos arrastrando)
    const state = this.carouselState.get(carousel);
    if (state?.isDown) {
      this.carouselState.delete(carousel);
      document.body.classList.remove('grabbing');
    }
  }

  public onMouseUp(carousel: HTMLElement): void {
    // El usuario soltó el clic
    this.carouselState.delete(carousel);
    document.body.classList.remove('grabbing');
  }

  public onMouseMove(e: MouseEvent, carousel: HTMLElement): void {
    const state = this.carouselState.get(carousel);
    // Si no está haciendo clic, no hagas nada
    if (!state || !state.isDown) return; 

    // Previene seleccionar texto
    e.preventDefault(); 
    
    // Calcula cuánto se ha movido el mouse
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - state.startX) * 2; // Multiplicamos por 2 para que sea más rápido
    
    // Mueve el scroll
    carousel.scrollLeft = state.scrollLeft - walk;
  }

}