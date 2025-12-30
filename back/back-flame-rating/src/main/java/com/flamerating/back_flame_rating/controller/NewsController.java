package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.service.INewsService;
import com.flamerating.back_flame_rating.service.NewsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class NewsController {private final INewsService newsService;

    public NewsController(INewsService newsService) {
        this.newsService = newsService;
    }

    // LISTAR
    @GetMapping("/news")
    public List<News> findAll() {
        return newsService.findAll();
    }

    // CREAR
    @PostMapping("/create-news")
    public News save(@RequestBody News news) {
        return newsService.saveNews(news);
    }

    // ELIMINAR
    @DeleteMapping("/delete-news/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Integer id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    // --- NUEVO: OBTENER UNA NOTICIA (Para precargar el form) ---
    // URL: http://localhost:8080/news/5
    @GetMapping("/news/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Integer id) {
        News news = newsService.findById(id);
        if (news != null) {
            return ResponseEntity.ok(news);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- NUEVO: ACTUALIZAR ---
    // URL: http://localhost:8080/update-news
    @PutMapping("/update-news")
    public ResponseEntity<News> updateNews(@RequestBody News news) {
        News updatedNews = newsService.updateNews(news);
        if (updatedNews != null) {
            return ResponseEntity.ok(updatedNews);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}