package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {
    @Query("SELECT a FROM UserAnswer AS a JOIN QuizAnswer AS q ON a.quizAnswer.id = q.id AND a.user.id = :userId AND q.quiz.id = :quizId")
    Optional<UserAnswer> find(@Param("quizId") String quizId,@Param("userId") String userId);

    @Query("SELECT a FROM UserAnswer AS a JOIN QuizAnswer AS q ON a.quizAnswer.id = q.id AND q.quiz.id = :quizId")
    List<UserAnswer> findByQuizId(@Param("quizId") String quizId);
}
