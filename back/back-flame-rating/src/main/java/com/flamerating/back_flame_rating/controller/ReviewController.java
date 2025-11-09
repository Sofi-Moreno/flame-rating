package com.flamerating.back_flame_rating.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.flamerating.back_flame_rating.service.ReviewService;
import com.flamerating.back_flame_rating.model.Review;

/*Permite  que todos los servicios o End Points que se creen dentro, puedan 
comunicarse con los clientes mediante Json.*/

@RestController 
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

/**Para poder guardar una entidad en una BD necesitamos manejar una petición de tipo
post, por lo que se utiliza la anotación @PostMapping */

/*La anotación RequestBody lo que hace es transformar la petición que viene desde el
cliente en un objeto de tipo Review(Java) si tener que usar alguna librería.*/
@PostMapping
    public Review save(@RequestBody Review review) {
        return reviewService.saveReview(review); //Guarda un objeto del tipo service
    }
}
