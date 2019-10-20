package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import java.util.Collection;
import java.util.HashMap;
import java.util.Optional;

public interface QuizService {
    Quiz create (Quiz obj);
    Optional<Quiz> read (String id);
    Collection<Quiz> readAll ();
    Collection<Quiz> readAll (Boolean isPublic, Integer size, Integer page);
    Collection<Quiz> readAll (HashMap<String, Object> filterParams, Integer size, Integer page);
    Collection<Quiz> readAllAssignedToUser (String userId, Integer size, Integer page);
    void update (Quiz obj);
    void delete (String id);
}
