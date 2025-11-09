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
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Review findById(Integer id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void deleteReview(Integer id) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Review updateReview(Review review) {
        // TODO Auto-generated method stub
        return null;
    }

    
}