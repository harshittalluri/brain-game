package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "scores")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 Proper relationship instead of userId
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String gameType;
    private int score;

    public Score() {}

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getGameType() {
        return gameType;
    }

    public int getScore() {
        return score;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
