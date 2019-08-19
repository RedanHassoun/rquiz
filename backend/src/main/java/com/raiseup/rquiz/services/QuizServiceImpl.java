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
    public Quiz create(Quiz quiz) {
        quiz.getAnswers().forEach(answer -> answer.setQuiz(quiz));

        return this.quizRepository.save(quiz);
    }

    @Override
    @Transactional(readOnly=true)
    public Optional<Quiz> read(String id) {
//        Quiz q = this.quizRepository.findWithAnswers(id);
//        this.logger.info("------------------------------");
//        this.logger.info(q.toString());
        return this.quizRepository.findById(id);
    }

    @Override
    public Collection<Quiz> readAll() {
        Collection<Quiz> quizList = this.quizRepository.findAll();

        this.initQuizAnswersCount(quizList);

        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic) {
        Collection<Quiz> quizList;

        if(isPublic == null){
            quizList = this.quizRepository.findAll();
            this.initQuizAnswersCount(quizList);
            return quizList;
        }

        quizList = this.quizRepository.findAllByPublic(isPublic);
        this.initQuizAnswersCount(quizList);
        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(int size, int page) {
        Collection<Quiz> quizList = this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                                                        .getContent();
        this.initQuizAnswersCount(quizList);

        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(Boolean isPublic, int size, int page) {
        Collection<Quiz> quizList;

        if(isPublic == null) {
            quizList = this.quizRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"))
                    .getContent();
            this.initQuizAnswersCount(quizList);
            return quizList;
        }

        quizList = this.quizRepository.findAllByPublic(isPublic, PageRequest.of(page,
                size,
                Sort.Direction.DESC,
                "createdAt"));
        this.initQuizAnswersCount(quizList);
        return quizList;
    }

    @Override
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams) {
        // TODO: should enable null for the pageable object / define as optional / create another method
        // in the repository
        return this.quizRepository.findQuizListByParameters(filterParams, null);
    }

    @Override
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams, int size, int page) {
        return this.quizRepository.findQuizListByParameters(filterParams,
                PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public void update(Quiz obj) {

    }

    @Override
    public void delete(String id) {

    }

    private void initQuizAnswersCount(Collection<Quiz> quizList){
        for(Quiz quiz : quizList) {
            final List<UserAnswer> userAnswersForQuiz =
                    this.userAnswerService.getUserAnswersForQuiz(quiz.getId());
            quiz.setTotalNumberOfAnswers(userAnswersForQuiz.size());
            Optional<Integer> correctNumOptional =
                    this.userAnswerService.getCorrectCount(userAnswersForQuiz);
            quiz.setNumberOfCorrectAnswers(correctNumOptional.orElse(null));
        }
    }
}
