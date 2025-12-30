package com.flamerating.back_flame_rating.service;

import java.time.LocalDate; // Importa LocalDate
import java.util.List;
import java.util.Optional; // Importa Optional

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
        // ¡IMPORTANTE! Asignamos la fecha actual automáticamente
        // justo antes de guardar la noticia.
        news.setPublicationDate(LocalDate.now());
        return newsRepository.save(news);
    }

    @Override
    public List<News> findAll() {
        // Usamos el nuevo método del repositorio para obtener las noticias
        // ya ordenadas desde la base de datos.
        return newsRepository.findAllByOrderByPublicationDateDesc();
    }

    @Override
    public News findById(Integer id) {
        // Implementación correcta de findById
        Optional<News> optionalNews = newsRepository.findById(id);
        return optionalNews.orElse(null); // Retorna la noticia o null si no se encuentra
    }


 @Override
    public void deleteNews(Integer id) {
        newsRepository.deleteById(id);
    }
// Dentro de NewsService.java

@Override
    public News updateNews(News news) {
        // Verificamos si existe la noticia que queremos editar
        if (news.getId() != null && newsRepository.existsById(news.getId())) {
            // Buscamos la original para no perder la fecha de publicación original
            News existingNews = newsRepository.findById(news.getId()).orElse(null);
            if (existingNews != null) {
                news.setPublicationDate(existingNews.getPublicationDate()); // Mantenemos fecha vieja
                return newsRepository.save(news);
            }
        }
        return null;
    }

}