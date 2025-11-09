package com.flamerating.back_flame_rating.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

/*http://localhost:8080/create-review*/
@PostMapping ("/create-review")
    public Review save(@RequestBody Review review) {
        return reviewService.saveReview(review); //Guarda un objeto del tipo service
    }

@GetMapping ("/reviews")
    public List<Review> findAll() {
        return reviewService.findAll();
    }

@GetMapping("/reviews/by-game/{id}")
    public List<Review> getReviewsByGameId(@PathVariable Integer id) {
        return reviewService.findByVideoGameId(id);
    }
}
