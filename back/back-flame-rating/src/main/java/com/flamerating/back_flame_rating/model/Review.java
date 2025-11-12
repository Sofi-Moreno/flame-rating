package com.flamerating.back_flame_rating.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews_video_games")

public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false)
    private String userName;
    @Column(nullable = false)
    private Integer videoGameId;
    @Column(nullable = false)
    private Float rating;
    @Column(nullable = true, length = 500)
    private String comment;

    public Review() {
    }

    public Review(Integer id, String userName, Integer videoGameId, Float rating, String comment) {
        this.id = id;
        this.userName = userName;
        this.videoGameId = videoGameId;
        this.rating = rating;
        this.comment = comment;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getVideoGame() {
        return videoGameId;
    }

    public void setVideoGame(Integer videoGameId) {
        this.videoGameId = videoGameId;
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
