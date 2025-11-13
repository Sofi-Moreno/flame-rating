package com.flamerating.back_flame_rating.model;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "video_games")

public class VideoGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true, nullable = false)
    private String title;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private String releaseDate;
    @Column(nullable = false, length = 2000)
    private String synopsis;
    @Column(nullable = false,length = 2000)
    private String urlTrailer;
    @Column(nullable = false)
    private String developer;
    @Column(nullable = false,length = 2000)
    private String urlImages;
    @Column(nullable = false, length = 500)
    private String platform;
    @Column(nullable = false, length = 500)
    private String genre;
    @Column(nullable = false, length = 500)
    private String category;
    @Column(nullable = false)
    private Double averageRating;
    
    public VideoGame() {
    }

    public VideoGame(Integer id, String title, String releaseDate, String synopsis, String urlTrailer,
            String developer, String urlImages, String platform, String genre, String category,
            Double averageRating) {
        this.id = id;
        this.title = title;
        this.releaseDate = releaseDate;
        this.synopsis = synopsis;
        this.urlTrailer = urlTrailer;
        this.developer = developer;
        this.urlImages = urlImages;
        this.platform = platform;
        this.genre = genre;
        this.category = category;
        this.averageRating = averageRating;
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

    public String getReleaseDate() {
        return releaseDate;
    }
    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getSynopsis() {
        return synopsis;
    }
    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getUrlTrailer() {
        return urlTrailer;
    }
    public void setUrlTrailer(String urlTrailer) {
        this.urlTrailer = urlTrailer;
    }

    public String getDeveloper() {
        return developer;
    }
    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getUrlImages() {
        return urlImages;
    }
    public void setUrlImages(String urlImages) {
        this.urlImages = urlImages;
    }

    public String getPlatform() {
        return platform;
    }
    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAverageRating() {
        return averageRating;
    }
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
