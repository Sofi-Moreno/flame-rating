package com.flamerating.back_flame_rating.controller;

import java.util.List;

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
    public VideoGame saveVideoGame(@RequestBody VideoGame videoGame) {
        return videoGameService.saveVideoGame(videoGame);
    }

    @GetMapping
    public List<VideoGame> findAll() {
        return videoGameService.findAll();
    }
}
