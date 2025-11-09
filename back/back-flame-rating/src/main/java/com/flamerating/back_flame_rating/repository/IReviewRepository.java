package com.flamerating.back_flame_rating.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flamerating.back_flame_rating.model.Review;

@Repository
public interface IReviewRepository extends JpaRepository <Review, Integer> {
    
}