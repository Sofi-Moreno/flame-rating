import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '../model/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiList:string = "http://localhost:8080/listNews";
  private apiCreate:string = "https://localhost:8080/create-news";
  private apiFindById:string = "https://localhost:8080/news-by-id/{id}";
  private apiDelete:string = "https://localhost:8080/delete-news/{id}";
  private apiUpdate:string = "https://localhost:8080/update-news";

  constructor(private http:HttpClient) { }
  getNews():Observable<News[]> { //La clase observablwe es un patrón de diseño que permite manejar elementos asincrónicos.
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
