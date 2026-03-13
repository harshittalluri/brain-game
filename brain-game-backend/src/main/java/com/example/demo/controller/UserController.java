package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import com.example.demo.config.JwtUtil;

import java.util.List;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository repo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // GET ALL USERS
    @GetMapping("/me")
    public User getCurrentUser() {

        String email = org.springframework.security.core.context
                .SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return repo.findByEmail(email).orElse(null);
    }


    // LOGIN USING EMAIL
    @PostMapping("/login")
    public String login(@RequestBody User user){

        User existingUser = repo.findByEmail(user.getEmail())
                .orElse(null);

        if(existingUser == null){
            return null;
        }

        if(passwordEncoder.matches(user.getPassword(), existingUser.getPassword())){
            return jwtUtil.generateToken(existingUser.getEmail());
        }

        return null;
    }

}
