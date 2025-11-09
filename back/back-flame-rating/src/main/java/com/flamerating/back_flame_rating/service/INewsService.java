package com.flamerating.back_flame_rating.service;

import com.flamerating.back_flame_rating.model.News;
import java.util.List;

public interface INewsService {

    List<News> getAllNews();

    /**
     * Crea una nueva noticia.
     * La implementación DEBE limpiar la entidad
     * (asignar fecha, poner ID a null) antes de guardarla.
     *
     * @param news La entidad News recibida desde el controlador.
     * @return La entidad News guardada.
     */
    News createNews(News news);
}