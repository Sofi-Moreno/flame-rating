package com.flamerating.back_flame_rating.controller;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.flamerating.back_flame_rating.service.ReviewService;
import com.flamerating.back_flame_rating.model.Review;

/*Permite  que todos los servicios o End Points que se creen dentro, puedan 
comunicarse con los clientes mediante Json.*/

@RestController 
@CrossOrigin(origins = "http://localhost:4200")
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
    public ResponseEntity<?> saveReview(@RequestBody Review review) {
        try{
            Review savedReview = reviewService.saveReview(review);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving review: " + e.getMessage());
        }
    }

@GetMapping ("/reviews")
    public ResponseEntity<?> findAll() {
        try{
            List<Review> reviews = reviewService.findAll();
            return ResponseEntity.ok(reviews);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error searching for all reviews: " + e.getMessage());
        }
    }

/*http://localhost:8080/by-game/{id}*/
@GetMapping("/reviews/by-game/{id}")
    public ResponseEntity<?> getReviewsByGameId(@PathVariable Integer id) {
        try{
            List<Review> reviews = reviewService.findByVideoGameId(id);
            return ResponseEntity.ok(reviews);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error searching for reviews by Id: " + id + " of videogame: " + e.getMessage());
        }
    }

/*http://localhost:8080/delete-review/{id}*/
@DeleteMapping("/delete-review/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id) {
        try{
            reviewService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("review deleted successfully.");
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting review with id: " + id + " : " + e.getMessage());
        }
    }

/*http://localhost:8080/review/{id}*/
@GetMapping ("/review/{id}")
    public ResponseEntity<?> findById(@PathVariable Integer id) {
        try{
            Review review = reviewService.findById(id);
            return ResponseEntity.ok(review);
        }
        catch (NoSuchElementException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error searching review by Id: " + id + " : " + e.getMessage());
        }
    }

/*http://localhost:8080/update-review*/
@PutMapping ("/update-review")
    public ResponseEntity<?> updateReview(@RequestBody Review review) {
        try {
                Review reviewDb = reviewService.findById(review.getId());
                reviewDb.setUserName(review.getUserName());
                reviewDb.setRating(review.getRating());
                reviewDb.setComment(review.getComment());
                Review updatedReview = reviewService.saveReview(reviewDb);
                return ResponseEntity.ok(updatedReview);
        }
        catch(NoSuchElementException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error updating review with id: " + review.getId() + " : " + e.getMessage()); //Id don't exist
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating review with id: " + review.getId() + " : " + e.getMessage()); //Incorrect data entered
        }
    }
}
