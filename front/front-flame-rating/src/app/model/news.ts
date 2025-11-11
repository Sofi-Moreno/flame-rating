// src/app/model/news.ts

export class News {
  id: number;
  title: string;
  publicationDate: string; // Se recibirá como string de la API (JSON)
  textNews: string;
  urlVideo: string;  // Coincide con el backend (urlVideo)
  urlImages: string;

  constructor(
    id: number, 
    title: string, 
    publicationDate: string, 
    textNews: string, 
    urlVideo: string,
    urlImages:string 
  ){
    this.id = id;
    this.title = title;
    this.publicationDate = publicationDate;
    this.textNews = textNews;
    this.urlVideo = urlVideo;
    this.urlImages = urlImages;
  }
}