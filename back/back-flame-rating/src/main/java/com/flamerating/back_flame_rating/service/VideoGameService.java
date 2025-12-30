package com.flamerating.back_flame_rating.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.flamerating.back_flame_rating.model.VideoGame;
import com.flamerating.back_flame_rating.repository.IVideoGameRepository;
import com.flamerating.back_flame_rating.repository.IReviewRepository;
import jakarta.transaction.Transactional;

@Service
public class VideoGameService implements IVideoGameService {
    private final IVideoGameRepository videoGameRepository;
    private final IReviewRepository reviewRepository;

    public VideoGameService(IVideoGameRepository videoGameRepository, IReviewRepository reviewRepository) {
        this.videoGameRepository = videoGameRepository;
        this.reviewRepository = reviewRepository;
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

    @Transactional
    @Override
    public void deleteVideoGame(Integer id) {
        reviewRepository.deleteByVideoGameId(id);
        videoGameRepository.deleteById(id);
    }

    @Override
    public VideoGame updateVideoGame(VideoGame videoGame) {
        return videoGameRepository.save(videoGame);
    }

    @Override
    public void updateAverageRating(Integer id, Double rating) {
        // Buscamos el videojuego por ID
        VideoGame game = videoGameRepository.findById(id)
            .orElseThrow();

        // Solo modificamos el campo del promedio
        game.setAverageRating(rating);

        // Guardamos los cambios en la BD
        videoGameRepository.save(game);
    }
}
