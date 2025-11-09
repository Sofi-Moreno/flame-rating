package com.flamerating.back_flame_rating.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.flamerating.back_flame_rating.model.VideoGame;
import com.flamerating.back_flame_rating.service.VideoGameService;

@RestController
public class VideoGameController {
    private final VideoGameService videoGameService;

    public VideoGameController(VideoGameService videoGameService) {
        this.videoGameService = videoGameService;
    }

    //localhost:8080
    @PostMapping ("/create-videogame")
    public ResponseEntity<?> saveVideoGame(@RequestBody VideoGame videoGame) {
        try {
            VideoGame saved = videoGameService.saveVideoGame(videoGame);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
        
    }

    @GetMapping
    public List<VideoGame> findAll() {
        return videoGameService.findAll();
    }

    @GetMapping("/search")
    public ResponseEntity<VideoGame> findByTitle(@RequestParam String title) {
        try {
            VideoGame videoGame = videoGameService.findByTitle(title);
            return ResponseEntity.ok(videoGame);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/videogame-by-id")
    public ResponseEntity<?> findById(@RequestParam Integer id) {
        try {
            videoGameService.findById(id);
            return ResponseEntity.ok(videoGameService.findById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video game not found.");
        }
    }

    @DeleteMapping("/delete-videogame")
    public ResponseEntity<?> deleteVideoGame(@RequestParam Integer id) {
        try {
            videoGameService.deleteVideoGame(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Video game deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update-videogame")
    public ResponseEntity<?> updateVideoGame(@RequestBody VideoGame videoGame) {
        try {
            VideoGame existing = videoGameService.findById(videoGame.getId());

            if (existing != null) {
                VideoGame toUpdate = existing;

                // Actualiza los campos necesarios
                toUpdate.setTitle(videoGame.getTitle());
                toUpdate.setGenre(videoGame.getGenre());
                toUpdate.setDeveloper(videoGame.getDeveloper());
                toUpdate.setPlatform(videoGame.getPlatform());
                toUpdate.setReleaseDate(videoGame.getReleaseDate());
                toUpdate.setSynopsis(videoGame.getSynopsis());
                toUpdate.setUrlImages(videoGame.getUrlImages());
                toUpdate.setUrlTrailer(videoGame.getUrlTrailer());
                toUpdate.setCategory(videoGame.getCategory());
                toUpdate.setAverageRating(videoGame.getAverageRating());

                VideoGame updated = videoGameService.updateVideoGame(toUpdate);
                return ResponseEntity.ok(updated);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("VideoGame with ID " + videoGame.getId() + " not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating VideoGame: " + e.getMessage());
        }
    }
    
}

