import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoGame } from '../model/video-game';

@Injectable({
  providedIn: 'root',
})
export class VideoGameService {
  private apiList:string = "https://localhost:8080/listVideogames";

  
  constructor(private http:HttpClient) { }
  getVideoGames():Observable<VideoGame[]> { //La clase observablwe es un patrón de diseño que permite manejar elementos asincrónicos.
    return this.http.get<VideoGame[]>(this.apiList);
  }

}
