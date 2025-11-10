package com.flamerating.back_flame_rating.repository;

import com.flamerating.back_flame_rating.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Importa List

@Repository
public interface INewsRepository extends JpaRepository<News, Integer> {

    // Este nuevo método buscará todas las noticias Y las ordenará por
    // el campo 'publicationDate' de forma descendente (Desc).
    List<News> findAllByOrderByPublicationDateDesc();
}