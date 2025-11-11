import { Component } from '@angular/core';
import { VideoGameService } from '../service/video-game-service';

@Component({
  selector: 'app-view-videogame',
  imports: [],
  templateUrl: './view-videogame.html',
  styleUrl: './view-videogame.css',
})
export class ViewVideogame {

  constructor(
    private videoGameService: VideoGameService
  ) {}

  ngOnInit(): void {

  }


}
