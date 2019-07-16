package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.Quiz;
import java.util.HashMap;
import java.util.List;

public interface QuizRepositoryCustom {
    List<Quiz> findQuizListByParameters(HashMap<String, Object> params);
}

