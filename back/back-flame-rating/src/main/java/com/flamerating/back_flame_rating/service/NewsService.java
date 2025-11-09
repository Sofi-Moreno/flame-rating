package com.flamerating.back_flame_rating.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.repository.INewsRepository;

@Service
public class NewsService implements INewsService {
    private final INewsRepository newsRepository;

    public NewsService(INewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Override
    public News saveNews(News news) {
        return newsRepository.save(news);
    }

    @Override
    public List<News> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }

    @Override
    public News findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }

    @Override
    public void deleteNews(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteVideoGame'");
    }

    @Override
    public News updateNews(News news) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateVideoGame'");
    }

}
