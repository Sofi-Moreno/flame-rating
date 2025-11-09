package com.flamerating.back_flame_rating.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.flamerating.back_flame_rating.model.Review;
import com.flamerating.back_flame_rating.repository.IReviewRepository;

@Service
public class ReviewService implements IReviewService {

    private final IReviewRepository iReviewRepository;

    

    public ReviewService(IReviewRepository iReviewRepository) {
        this.iReviewRepository = iReviewRepository;
    }

    @Override
    public Review saveReview(Review review) {
        return iReviewRepository.save(review);
    }

    @Override
    public List<Review> findAll() {
        return iReviewRepository.findAll();
    }

    @Override
    public Review findById(Integer id) {
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public void deleteReview(Integer id) {
        throw new UnsupportedOperationException("Unimplemented method 'deleteVideoGame'");

    }

    @Override
    public Review updateReview(Review review) {
        throw new UnsupportedOperationException("Unimplemented method 'updateVideoGame'");

    }
}