package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.service.NewsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class NewsController {
    
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // LISTAR (Coincide con tu front: /news)
    @GetMapping ("/news")
    public List<News> findAll() {
        return newsService.findAll();
    }

    // CREAR (Coincide con tu front: /create-news)
    @PostMapping("/create-news")
    public News save(@RequestBody News news) {
        return newsService.saveNews(news); 
    }

    // --- CORRECCIÓN AQUÍ ---
    // Antes tenías: @DeleteMapping("/{id}") -> http://localhost:8080/1
    // AHORA: Coincide con tu front -> http://localhost:8080/delete-news/1
    @DeleteMapping("/delete-news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Integer id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}