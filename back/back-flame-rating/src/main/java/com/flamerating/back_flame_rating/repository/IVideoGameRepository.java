package com.flamerating.back_flame_rating.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.flamerating.back_flame_rating.model.VideoGame;
import jakarta.transaction.Transactional;

@Repository
public interface IVideoGameRepository extends JpaRepository<VideoGame, Integer> {
    Optional<VideoGame> findByTitle(String title);

    @Modifying
    @Transactional
    @Query("UPDATE VideoGame v SET v.averageRating = :rating WHERE v.id = :id")
    void updateRatingOnly(@Param("id") Integer id, @Param("rating") Double rating);
}
