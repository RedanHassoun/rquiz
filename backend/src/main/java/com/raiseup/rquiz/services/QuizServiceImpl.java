package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.UserAnswer;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class QuizServiceImpl implements QuizService {
    private Logger logger = LoggerFactory.getLogger(QuizServiceImpl.class);
    private QuizRepository quizRepository;
    private UserAnswerService userAnswerService;

    public QuizServiceImpl(QuizRepository quizRepository,
                           UserAnswerService userAnswerService){
        this.quizRepository = quizRepository;
        this.userAnswerService = userAnswerService;
    }

    @Override
    @Transactional
    public Quiz create(Quiz quiz) {
        quiz.getAnswers().forEach(answer -> answer.setQuiz(quiz));

        return this.quizRepository.save(quiz);
    }

    @Override
    @Transactional(readOnly=true)
    public Optional<Quiz> read(String id) {
        Optional<Quiz> quizOptional = this.quizRepository.findById(id);
        if(!quizOptional.isPresent()){
            return Optional.empty();
        }
        Quiz quiz = quizOptional.get();
        this.initQuizAnswersCount(quiz);
        return Optional.of(quiz);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll() {
        Collection<Quiz> quizList = this.quizRepository.findAll();

        this.initQuizListAnswersCount(quizList);

        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic) {
        Collection<Quiz> quizList;

        if(isPublic == null){
            quizList = this.quizRepository.findAll();
            this.initQuizListAnswersCount(quizList);
            return quizList;
        }

        quizList = this.quizRepository.findAllByPublic(isPublic);
        this.initQuizListAnswersCount(quizList);
        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(int size, int page) {
        Collection<Quiz> quizList = this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                                                        .getContent();
        this.initQuizListAnswersCount(quizList);

        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic, int size, int page) {
        Collection<Quiz> quizList;

        if(isPublic == null) {
            quizList = this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                    .getContent();
            this.initQuizListAnswersCount(quizList);
            return quizList;
        }

        quizList = this.quizRepository.findAllByPublic(isPublic, PageRequest.of(page,
                size,
                Sort.Direction.DESC,
                "createdAt"));
        this.initQuizListAnswersCount(quizList);
        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams) {
        // TODO: should enable null for the pageable object / define as optional / create another method
        // in the repository
        return this.quizRepository.findQuizListByParameters(filterParams, null);
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams, int size, int page) {
        return this.quizRepository.findQuizListByParameters(filterParams,
                PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
    }

    @Override
    @Transactional
    public void update(Quiz obj) {

    }

    @Override
    @Transactional
    public void delete(String id) {

    }

    private void initQuizListAnswersCount(Collection<Quiz> quizList){
        for(Quiz quiz : quizList) {
            this.initQuizAnswersCount(quiz);
        }
    }

    private void initQuizAnswersCount(Quiz quiz){
        final List<UserAnswer> userAnswersForQuiz =
                this.userAnswerService.getUserAnswersForQuiz(quiz.getId());
        quiz.setTotalNumberOfAnswers(userAnswersForQuiz.size());
        Optional<Integer> correctNumOptional =
                this.userAnswerService.getCorrectCount(userAnswersForQuiz);
        quiz.setNumberOfCorrectAnswers(correctNumOptional.orElse(null));
    }
}
