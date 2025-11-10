import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoGame } from '../model/video-game';

@Injectable({
  providedIn: 'root',
})
export class VideoGameService {
  private apiList:string = "http://localhost:8080/listVideogames";
  private apiCreate:string = "https://localhost:8080/create-videogame";
  private apiFindByTitle:string = "https://localhost:8080/search/{title}";
  private apiFindById:string = "https://localhost:8080/videogame-by-id/{id}";
  private apiDelete:string = "https://localhost:8080/delete-videogame/{id}";
  private apiUpdate:string = "https://localhost:8080/update-videogame";

  constructor(private http:HttpClient) { }
  getVideoGames():Observable<VideoGame[]> { //La clase observablwe es un patrón de diseño que permite manejar elementos asincrónicos.
    return this.http.get<VideoGame[]>(this.apiList);
  }

  createVideoGame(videoGame:VideoGame):Observable<VideoGame>{
    return this.http.post<VideoGame>(this.apiCreate, videoGame);
  }

  findByTitle(title:string):Observable<VideoGame>{
    return this.http.get<VideoGame>(this.apiFindByTitle.replace("{title}", title));
  }

  findById(id:number):Observable<VideoGame>{
    return this.http.get<VideoGame>(this.apiFindById.replace("{id}", id.toString()));
  }

  deleteVideoGame(id:number):Observable<void>{
    return this.http.delete<void>(this.apiDelete.replace("{id}", id.toString()));
  }

  updateVideoGame(videoGame:VideoGame):Observable<VideoGame>{
    return this.http.put<VideoGame>(this.apiUpdate, videoGame);
  }
}
