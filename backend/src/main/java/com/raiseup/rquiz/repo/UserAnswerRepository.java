package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {
    @Query("SELECT a FROM UserAnswer AS a WHERE a.applicationUser.getId() = :userId AND a.quiz.getId() = :quizId")
    Optional<UserAnswer> find(@Param("quizId") String quizId,@Param("userId") String userId);
}
