// Import or declare Review type
import { Review } from './review';
export class VideoGame {
    category: any;
    urlImages: any;
    urlTrailer:any;
    image: any;
    title: any;
    synopsis: any;
    averageRating: any;
    platform: any;
    releaseDate:any;
    developer: any;
    id: any|string;
    genre: any;
    reviews:any;
    constructor(
        id: number, // Autogenerado
        title: string, // Único y obligatorio
        releaseDate: string, // Formato 'yyyy-MM-dd'
        synopsis: string, // Máximo 2000 caracteres
        urlTrailer: string,
        developer: string,
        urlImages: string,
        platform: string, // Máximo 500 caracteres
        genre: string, // Máximo 500 caracteres
        category: string, // Máximo 500 caracteres
        averageRating: number,
        reviews: Review[][] // Transitorio, opcional
    ){}
    
}