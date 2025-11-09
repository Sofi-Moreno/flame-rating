package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.service.INewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:4200")
public class NewsController {

    @Autowired
    private INewsService newsService;

    @GetMapping
    public List<News> obtenerTodasLasNoticias() {
        return newsService.getAllNews();
    }
}