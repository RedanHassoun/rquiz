package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
