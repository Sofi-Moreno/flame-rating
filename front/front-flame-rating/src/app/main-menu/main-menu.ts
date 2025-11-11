import { Component, OnInit } from '@angular/core';
import { VideoGame } from '../model/video-game';
import { VideoGameService } from '../service/video-game-service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css',
})
export class MainMenu implements OnInit {
  videoGames: {[key: string]: VideoGame[]} = {};
  categorys: string[] = ["Un Jugador","Multijugador","En linea"];

  constructor(
    private videoGameService: VideoGameService
  ) {}

  ngOnInit(): void {
    this.videoGameService.getVideoGames().subscribe((data: VideoGame[]) => {
    this.videoGames = this.organizeByCategory(data);
    });
  }
  
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

  public getPlatformsArray(platformsString: string | undefined | null): string[] {
    // Verificación para evitar errores si la propiedad es nula o vacía
    if (!platformsString) {
      return [];
    }
    return platformsString.split(',').map(plataforma => plataforma.trim());
  }

}