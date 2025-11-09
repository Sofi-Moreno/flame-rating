package com.flamerating.back_flame_rating.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
}
