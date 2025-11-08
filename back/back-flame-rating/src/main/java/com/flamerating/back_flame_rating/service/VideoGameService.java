package com.flamerating.back_flame_rating.service;

import java.util.List;
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    @Override
    public VideoGame findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public void deleteVideoGame(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteVideoGame'");
    }

    @Override
    public VideoGame updateVideoGame(VideoGame videoGame) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateVideoGame'");
    }

}
