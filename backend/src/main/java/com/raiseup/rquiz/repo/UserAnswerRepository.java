package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, String> {
}
