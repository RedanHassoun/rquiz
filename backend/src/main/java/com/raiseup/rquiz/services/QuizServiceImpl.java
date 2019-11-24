package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.UserAnswer;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Collection<Quiz> readAll(Boolean isPublic, Integer size, Integer page) {
        Collection<Quiz> quizList;
        Pageable pageable = null;

        if(size != null && page != null) {
            this.logger.debug(String.format("Preparing page request for fetching quiz list. page=%d, size=%d",
                    page, size));
            pageable = PageRequest.of(page, size,
                    Sort.Direction.DESC, "createdAt");
        }

        if(isPublic == null) {
            quizList = this.quizRepository.findAll(pageable)
                    .getContent();
            this.initQuizListAnswersCount(quizList);
            return quizList;
        }

        quizList = this.quizRepository.findAllByPublic(isPublic, pageable);
        this.initQuizListAnswersCount(quizList);
        return quizList;
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAll(HashMap<String, Object> filterParams, Integer size, Integer page) {
        if(size == null || page == null)
            return this.quizRepository.findQuizListByParameters(filterParams,null);

        return this.quizRepository.findQuizListByParameters(filterParams,
                PageRequest.of(page, size, Sort.Direction.DESC, "createdAt"));
    }

    @Override
    @Transactional(readOnly=true)
    public Collection<Quiz> readAllAssignedToUser(String userId, Integer size, Integer page) {
        if(size == null || page == null){
            return this.quizRepository.findByAssignedUsers_Id(userId, null);
        }
        return this.quizRepository.findByAssignedUsers_Id(userId,
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
