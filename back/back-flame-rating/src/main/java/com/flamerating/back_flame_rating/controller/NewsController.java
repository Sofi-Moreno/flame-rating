package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.service.INewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:4200")
public class NewsController {

    @Autowired
    private INewsService newsService;

    /**
     * GET /api/news : Obtiene todas las noticias
     */
    @GetMapping
    public ResponseEntity<List<News>> obtenerTodasLasNoticias() {
        List<News> newsList = newsService.getAllNews();
        return ResponseEntity.ok(newsList);
    }

    /**
     * POST /api/news : Crea una nueva noticia
     *
     */
    @PostMapping
    public ResponseEntity<News> crearNoticia(@RequestBody News news) { // <-- Cambio: Acepta la entidad
        // Pasa la entidad directamente al servicio,
        // que se encargará de limpiarla y guardarla.
        News nuevaNoticia = newsService.createNews(news);
        return new ResponseEntity<>(nuevaNoticia, HttpStatus.CREATED);
    }

}