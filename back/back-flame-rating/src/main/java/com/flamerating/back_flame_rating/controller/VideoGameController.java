package com.flamerating.back_flame_rating.controller;

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

    @PostMapping ("/create-videogame")
    public VideoGame saveVideoGame(@RequestBody VideoGame videoGame) {
        return videoGameService.saveVideoGame(videoGame);
    }
}
