package com.flamerating.back_flame_rating.service;

import com.flamerating.back_flame_rating.model.News;


import java.util.List;

public interface INewsService {

    News saveNews(News news);
    List<News> findAll();
    News findById(Integer id);
    void deleteNews(Integer id);
    News updateNews(News news);
}