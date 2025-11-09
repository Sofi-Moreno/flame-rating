package com.flamerating.back_flame_rating.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.flamerating.back_flame_rating.model.VideoGame;

@Repository
public interface IVideoGameRepository extends JpaRepository<VideoGame, Integer> {
    Optional<VideoGame> findByTitle(String title);
}
