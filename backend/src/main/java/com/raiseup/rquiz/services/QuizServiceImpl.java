package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.repo.QuizRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional(readOnly=true)
    public Optional<Quiz> read(String id) {
        return Optional.empty();
    }

    @Override
    public Collection<Quiz> readAll() {
        return this.quizRepository.findAll();
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic) {
        if(isPublic == null){
            return this.quizRepository.findAll();
        }
        return this.quizRepository.findAllByPublic(isPublic);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(int size, int page) {
        return this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.ASC, "id"))
                    .getContent();
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic, int size, int page) {
        if(isPublic == null)
            return this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.ASC, "id"))
                    .getContent();

        return this.quizRepository.findAllByPublic(isPublic, PageRequest.of(page, size, Sort.Direction.ASC, "id"));
    }

    @Override
    public void update(Quiz obj) {

    }

    @Override
    public void delete(String id) {

    }
}
