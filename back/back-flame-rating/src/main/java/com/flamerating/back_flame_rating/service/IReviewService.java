package com.flamerating.back_flame_rating.service;

import java.util.List;
import com.flamerating.back_flame_rating.model.Review;

public interface IReviewService {
    Review saveReview(Review review);
    List<Review> findAll();
    Review findById(Integer id);
    void deleteReview(Integer id);
    Review updateReview(Review review);
    List<Review> findByVideoGameId(Integer videoGameId);
}