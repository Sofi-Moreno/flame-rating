package com.flamerating.back_flame_rating.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews_video_games")

public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private Integer idUser;
    @ManyToOne
    @JoinColumn(name = "video_game_id", nullable = false)
    private VideoGame videoGame;
    @Column(nullable = false)
    private Float rating;
    @Column(nullable = true, length = 500)
    private String comment;

    public Review() {
    }

    public Review(Integer id, Integer idUser, VideoGame videoGame, Float rating, String comment) {
        this.id = id;
        this.idUser = idUser;
        this.videoGame = videoGame;
        this.rating = rating;
        this.comment = comment;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getIdUser() {
        return idUser;
    }
    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }

    public VideoGame getVideoGame() {
        return videoGame;
    }

    public void setVideoGame(VideoGame videoGame) {
        this.videoGame = videoGame;
    }

    public Float getRating() {
        return rating;
    }
    public void setRating(Float rating) {
        this.rating = rating;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
}
