package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.repo.QuizRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;
import java.util.Optional;

@Service
public class QuizServiceImpl implements QuizService {
    private QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository){
        this.quizRepository = quizRepository;
    }

    @Override
    public Quiz create(Quiz obj) {
        return this.quizRepository.save(obj);
    }

    @Override
    public Optional<Quiz> read(String id) {
        return this.quizRepository.findById(id);
    }

    @Override
    public Collection<Quiz> readAll() {
        return this.quizRepository.findAll();
    }

    @Override
    public Collection<Quiz> readAll(Boolean isPublic) {
        if(isPublic == null){
            return this.quizRepository.findAll();
        }
        return this.quizRepository.findAllByPublic(isPublic);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(int size, int page) {
        return this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                    .getContent();
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic, int size, int page) {
        if(isPublic == null)
            return this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                    .getContent();

        return this.quizRepository.findAllByPublic(isPublic, PageRequest.of(page,
                                                                            size,
                                                                            Sort.Direction.DESC,
                                                                   "createdAt"));
    }

    @Override
    public void update(Quiz obj) {

    }

    @Override
    public void delete(String id) {

    }
}
