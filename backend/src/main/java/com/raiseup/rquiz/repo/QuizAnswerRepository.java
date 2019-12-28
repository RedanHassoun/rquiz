package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.QuizAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, String> {
}
