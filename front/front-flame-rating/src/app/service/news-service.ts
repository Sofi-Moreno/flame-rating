// src/app/service/news-service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../model/news'; // Asegúrate que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  // --- CORRECCIÓN ---
  // Tu backend usa "/news", no "/listNews"
  private apiList:string = "http://localhost:8080/news"; 
  
  // El resto de tus URLs (create, findById, etc.) parecen tener
  // un "https" o no coincidir con el controlador.
  // Revísalas cuando vayas a implementar esas funciones.
  // Por ahora, solo nos enfocamos en apiList.

  private apiCreate:string = "http://localhost:8080/create-news"; // Debería ser http
  private apiFindById:string = "http://localhost:8080/news-by-id/{id}"; // No está en tu controller
  private apiDelete:string = "http://localhost:8080/delete-news/{id}"; // No está en tu controller
  private apiUpdate:string = "http://localhost:8080/update-news"; // No está en tu controller


  constructor(private http:HttpClient) { }

  // Esta función es la que usaremos
  getNews():Observable<News[]> {
    return this.http.get<News[]>(this.apiList);
  }

  createNews(news:News):Observable<News>{
    return this.http.post<News>(this.apiCreate, news);
  }

  findById(id:number):Observable<News>{
    return this.http.get<News>(this.apiFindById.replace("{id}", id.toString()));
  }

  deleteNews(id:number):Observable<void>{
    return this.http.delete<void>(this.apiDelete.replace("{id}", id.toString()));
  }

  updateNews(news:News):Observable<News>{
    return this.http.put<News>(this.apiUpdate, news);
  }

}