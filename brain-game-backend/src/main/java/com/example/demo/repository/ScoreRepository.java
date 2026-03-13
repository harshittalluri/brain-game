package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.entity.Score;

public interface ScoreRepository extends JpaRepository<Score, Long> {

	@Query("""
			SELECT s.user.username, MAX(s.score)
			FROM Score s
			WHERE s.gameType = :gameType
			GROUP BY s.user.username
			ORDER BY MAX(s.score) DESC
			""")
			List<Object[]> findLeaderboard(@Param("gameType") String gameType);
}
