package com.flamerating.back_flame_rating.service;

import com.flamerating.back_flame_rating.model.News;
import com.flamerating.back_flame_rating.repository.INewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NewsService implements INewsService { // Este nombre coincide con tu imagen

    @Autowired
    private INewsRepository newsRepository;

    @Override
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    @Override
    public News createNews(News news) { // <-- Cambio: Acepta la entidad

        // --- LÓGICA DE SEGURIDAD (lo que hacía el DTO) ---
        // 1. Asignamos la fecha de publicación en el servidor.
        //    Ignoramos cualquier fecha que el cliente haya podido enviar.
        news.setPublicationDate(LocalDate.now());

        // 2. Forzamos el ID a ser nulo.
        //    Esto asegura que JPA haga un 'INSERT' (crear)
        //    y no un 'UPDATE' (actualizar).
        news.setId(null);
        // --------------------------------------------------

        // 3. Guardamos la entidad "limpia"
        return newsRepository.save(news);
    }
}