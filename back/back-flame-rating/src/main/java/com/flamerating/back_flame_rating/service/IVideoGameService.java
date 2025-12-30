package com.flamerating.back_flame_rating.service;

import java.util.List;

import com.flamerating.back_flame_rating.model.VideoGame;

public interface IVideoGameService {
    VideoGame saveVideoGame(VideoGame videoGame);
    List<VideoGame> findAll();
    VideoGame findByTitle(String title);
    VideoGame findById(Integer id);
    void deleteVideoGame(Integer id);
    VideoGame updateVideoGame(VideoGame videoGame);
    void updateAverageRating(Integer id, Double rating);
}