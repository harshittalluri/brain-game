package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.demo.entity.Score;
import com.example.demo.entity.User;
import com.example.demo.repository.ScoreRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:3000")
public class ScoreController {

    private final ScoreRepository repo;
    private final UserRepository userRepository;

    public ScoreController(ScoreRepository repo,
                           UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Score saveScore(@RequestBody Score score){

        String email = org.springframework.security.core.context
                .SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        score.setUser(user);

        return repo.save(score);
    }

    @GetMapping("/{gameType}")
    public List<Object[]> leaderboard(@PathVariable String gameType){
        return repo.findLeaderboard(gameType);
    }
}
