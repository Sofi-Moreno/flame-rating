package com.flamerating.back_flame_rating.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "news")

public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(unique = true, nullable = false)
    private String title;
    
    @Column(nullable = false)
    private LocalDate publicationDate;
    
    @Column(nullable = false, length = 2000)
    private String textNews;
    
    // --- CAMBIO AQUÍ ---
    // He quitado "nullable = false"
    // Ahora este campo PUEDE estar vacío (null)
    @Column 
    private String urlVideo;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String urlImages;

    public News() {
    }

    // ... (El resto de tu archivo: constructores, getters y setters no cambian) ...
    // ... (Puedes dejarlos tal como estaban) ...

    public News(Integer id, String title, LocalDate publicationDate, String textNews, String urlVideo, String urlImages) {
        this.id = id;
        this.title = title;
        this.publicationDate = publicationDate;
        this.textNews = textNews;
        this.urlVideo = urlVideo;
        this.urlImages = urlImages;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public String getTextNews() {
        return textNews;
    }

    public void setTextNews(String textNews) {
        this.textNews = textNews;
    }

    public String getUrlVideo() {
        return urlVideo;
    }

    public void setUrlVideo(String urlVideo) {
        this.urlVideo = urlVideo;
    }

    public String getUrlImages() {
        return urlImages;
    }

    public void setUrlImages(String urlImages) {
        this.urlImages = urlImages;
    }
}