package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.service.NewsService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

/*Permite  que todos los servicios o End Points que se creen dentro, puedan
comunicarse con los clientes mediante Json.*/

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    /**Para poder guardar una entidad en una BD necesitamos manejar una petición de tipo
     post, por lo que se utiliza la anotación @PostMapping */

/*La anotación RequestBody lo que hace es transformar la petición que viene desde el
cliente en un objeto de tipo News(Java) si tener que usar alguna librería hola.*/

    /*http://localhost:8080/create-news*/
    @PostMapping("/create-news")
    public News save(@RequestBody News news) {
        return newsService.saveNews(news); //Guarda un objeto del tipo service
    }

    @GetMapping ("/news")
    public List<News> findAll() {
        return newsService.findAll();
    }
}