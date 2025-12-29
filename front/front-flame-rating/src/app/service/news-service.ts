import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../model/news'; 

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  
  // URLs alineadas con el Backend corregido:
  private apiList: string = "http://localhost:8080/news"; 
  private apiCreate: string = "http://localhost:8080/create-news";
  
  // Esta URL ahora SÍ existe en el backend gracias al cambio anterior
  private apiDelete: string = "http://localhost:8080/delete-news/{id}"; 

  // Estas las dejamos pendientes como las tenías
  private apiFindById: string = "http://localhost:8080/news-by-id/{id}"; 
  private apiUpdate: string = "http://localhost:8080/update-news"; 


  constructor(private http: HttpClient) { }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiList);
  }

  createNews(news: News): Observable<News>{
    return this.http.post<News>(this.apiCreate, news);
  }

  deleteNews(id: number): Observable<void>{
    // Reemplaza {id} por el número real y llama a /delete-news/X
    return this.http.delete<void>(this.apiDelete.replace("{id}", id.toString()));
  }

  // Pendientes de implementar en el backend
  findById(id: number): Observable<News>{
    return this.http.get<News>(this.apiFindById.replace("{id}", id.toString()));
  }

  updateNews(news: News): Observable<News>{
    return this.http.put<News>(this.apiUpdate, news);
  }
}