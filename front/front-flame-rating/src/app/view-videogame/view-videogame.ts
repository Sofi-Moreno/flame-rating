import { Component, OnInit } from '@angular/core';
import { VideoGameService } from '../service/video-game-service';
import { ActivatedRoute } from '@angular/router';
import { VideoGame } from '../model/video-game';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

  videoGame: VideoGame | null = null;
  currentBigMediaUrl: SafeResourceUrl | string | null = null;
  isTrailerActive: boolean = true;
  safeVideoUrl: SafeResourceUrl | null = null;
  // Variable para la imagen grande
  mainImageSrc: string | null = null;
  // Para saber qué miniatura está activa
  selectedMediaUrl: string | SafeResourceUrl = '';
  imageList: GameImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private gameService: VideoGameService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.gameService.findById(id).subscribe(game => {
          if (game) {
            this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(game.urlTrailer);
            if (game.urlImages && typeof game.urlImages === 'string') {
              const urlArray = (game.urlImages as string)
                .split(',')
                .map(url => url.trim()); // Esto te da ['url1.jpg', 'url2.jpg']
              // 4. Aquí está la magia: transforma el array de strings en un array de objetos
              this.imageList = urlArray.map((url, index) => {
                return {
                  largeSrc: url,     // La URL original es la imagen grande
                  thumbnailSrc: url, // Usamos la *misma* URL para la miniatura
                  alt: `Imagen de galería ${index + 1}` // Generamos un 'alt' descriptivo
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

          }
          this.videoGame = game;
        });
      }
    });
  }

  // --- 3. Funciones de Clic ---

  selectTrailer(): void {
    // Limpiamos la URL con autoplay y mute
    const trailerRaw = this.videoGame?.urlTrailer ?? '';
    const url = `${trailerRaw}`;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    
    // Ocultamos la imagen principal
    this.mainImageSrc = null; 
    
    // Marcamos esta miniatura como activa (usamos la URL en string)
    this.selectedMediaUrl = url;
  }

  selectImage(image: GameImage): void {
    // Mostramos la imagen grande
    this.mainImageSrc = image.largeSrc;
    
    // Ocultamos el video y detenemos su reproducción
    this.safeVideoUrl = null; 
    
    // Marcamos esta miniatura como activa
    this.selectedMediaUrl = image.thumbnailSrc; 
  }
}