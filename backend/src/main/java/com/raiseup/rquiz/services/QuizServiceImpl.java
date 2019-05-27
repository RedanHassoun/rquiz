package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.repo.QuizRepository;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
public class QuizServiceImpl implements QuizService {
    private QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository){
        this.quizRepository = quizRepository;
    }

    @Override
    public Quiz create(Quiz obj) {
        String id = UUID.randomUUID().toString();
        obj.setId(id);
        return this.quizRepository.save(obj);
    }

    @Override
    public Optional<Quiz> read(String id) {
        return Optional.empty();
    }

    @Override
    public Collection<Quiz> readAll() {
        return this.quizRepository.findAll();
    }

    @Override
    public Collection<Quiz> readAll(int size, int page) {
        return null;
    }

    @Override
    public void update(Quiz obj) {

    }

    @Override
    public void delete(String id) {

    }
}
