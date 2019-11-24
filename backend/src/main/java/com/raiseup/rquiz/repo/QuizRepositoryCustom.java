package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.Quiz;
import java.util.HashMap;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface QuizRepositoryCustom {
    List<Quiz> findQuizListByParameters(HashMap<String, Object> params, Pageable pageable);
}

