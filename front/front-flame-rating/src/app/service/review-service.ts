import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from '../model/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiList:string = "http://localhost:8080/reviews";
  private apiCreate:string = "http://localhost:8080/create-review";
  private apiFindById:string = "http://localhost:8080/review/{id}";
  private apiFindByVideoGameId:string = "http://localhost:8080/reviews/by-game/{id}";
  private apiDelete:string = "http://localhost:8080/delete-review/{id}";
  private apiUpdate:string = "http://localhost:8080/update-review";

  constructor(private http:HttpClient){}

    getReviews():Observable<Review[]> { 
      return this.http.get<Review[]>(this.apiList);
    }
  
    createReview(review:Review):Observable<Review>{
      return this.http.post<Review>(this.apiCreate, review);
    }
  
    findByVideoGameId(id:number):Observable<Review>{
      return this.http.get<Review>(this.apiFindByVideoGameId.replace("{id}", id.toString()));
    }
  
    findById(id:number):Observable<Review>{
      return this.http.get<Review>(this.apiFindById.replace("{id}", id.toString()));
    }
  
    deleteReview(id:number):Observable<void>{
      return this.http.delete<void>(this.apiDelete.replace("{id}", id.toString()));
    }
  
    updateVideoGame(review:Review):Observable<Review>{
      return this.http.put<Review>(this.apiUpdate, review);
    }
}

