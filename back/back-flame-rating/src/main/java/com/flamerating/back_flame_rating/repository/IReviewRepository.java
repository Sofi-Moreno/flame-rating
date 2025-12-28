package com.flamerating.back_flame_rating.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import com.flamerating.back_flame_rating.model.Review;

@Repository
public interface IReviewRepository extends JpaRepository <Review, Integer> {
    List<Review> findByVideoGameId(Integer videoGameId);
    
    @Transactional
    @Modifying
    void deleteByVideoGameId(Integer videoGameId);
}