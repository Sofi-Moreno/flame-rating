import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../model/news'; 

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  
  // Rutas base
  private apiList: string = "http://localhost:8080/news"; 
  private apiCreate: string = "http://localhost:8080/create-news";
  private apiDelete: string = "http://localhost:8080/delete-news/{id}"; 
  
  // --- VERIFICA ESTAS DOS RUTAS ---
  // Esta debe ser la ruta donde tu backend devuelve UNA sola noticia
  private apiFindById: string = "http://localhost:8080/news/{id}"; 
  
  // Esta debe ser la ruta PUT de tu backend
  private apiUpdate: string = "http://localhost:8080/update-news"; 

  constructor(private http: HttpClient) { }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiList);
  }

  createNews(news: News): Observable<News>{
    return this.http.post<News>(this.apiCreate, news);
  }

  deleteNews(id: number): Observable<void>{
    return this.http.delete<void>(this.apiDelete.replace("{id}", id.toString()));
  }

  // Buscar por ID (Es vital para precargar el formulario)
  findById(id: number): Observable<News>{
    return this.http.get<News>(this.apiFindById.replace("{id}", id.toString()));
  }

  // Actualizar
  updateNews(news: News): Observable<News>{
    return this.http.put<News>(this.apiUpdate, news);
  }
}