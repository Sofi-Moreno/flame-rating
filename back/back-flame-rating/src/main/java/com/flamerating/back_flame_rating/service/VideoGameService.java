package com.flamerating.back_flame_rating.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.flamerating.back_flame_rating.model.VideoGame;
import com.flamerating.back_flame_rating.repository.IVideoGameRepository;

@Service
public class VideoGameService implements IVideoGameService {
    private final IVideoGameRepository videoGameRepository;

    public VideoGameService(IVideoGameRepository videoGameRepository) {
        this.videoGameRepository = videoGameRepository;
    }

    @Override
    public VideoGame saveVideoGame(VideoGame videoGame) {
        return videoGameRepository.save(videoGame);
    }

    @Override
    public List<VideoGame> findAll() {
        return videoGameRepository.findAll();
    }

    @Override
    public VideoGame findByTitle(String title) {
        Optional<VideoGame> optionalVideoGame = videoGameRepository.findByTitle(title);
        return optionalVideoGame.orElse(null);
    }

    @Override
    public VideoGame findById(Integer id) {
       return videoGameRepository.findById(id).get();
    }

    @Override
    public void deleteVideoGame(Integer id) {
        videoGameRepository.deleteById(id);
    }

    @Override
    public VideoGame updateVideoGame(VideoGame videoGame) {
        return videoGameRepository.save(videoGame);
    }

}
