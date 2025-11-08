package com.flamerating.back_flame_rating.service;

import java.util.List;
import com.flamerating.back_flame_rating.model.VideoGame;

public interface IVideoGameService {
    VideoGame saveVideoGame(VideoGame videoGame);
    List<VideoGame> findAll();
    VideoGame findById(Integer id);
    void deleteVideoGame(Integer id);
    VideoGame updateVideoGame(VideoGame videoGame);
}