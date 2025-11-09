package com.flamerating.back_flame_rating.repository;

<<<<<<< HEAD

=======
import java.util.Optional;
>>>>>>> d8c1f5c04365ac7484fae3bbec64252cbabf566e
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.flamerating.back_flame_rating.model.VideoGame;

@Repository
public interface IVideoGameRepository extends JpaRepository<VideoGame, Integer> {
    Optional<VideoGame> findByTitle(String title);
}
