package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface QuizService {
    Quiz create (Quiz obj);
    Optional<Quiz> read (String id);
    Collection<Quiz> readAll ();
    Collection<Quiz> readAll (Boolean isPublic);
    Collection<Quiz> readAll (int size, int page);
    Collection<Quiz> readAll (Boolean isPublic, int size, int page);
    Collection<Quiz> readAll (HashMap<String, Object> filterParams);
    Collection<Quiz> readAll (HashMap<String, Object> filterParams, int size, int page);
    void update (Quiz obj);
    void delete (String id);
}
