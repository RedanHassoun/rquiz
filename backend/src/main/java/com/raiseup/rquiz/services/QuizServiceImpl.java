package com.raiseup.rquiz.services;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.models.db.UserAnswer;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
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
    private ApplicationUserRepository applicationUserRepository;

    public QuizServiceImpl(QuizRepository quizRepository,
                           UserAnswerService userAnswerService,
                           ApplicationUserRepository applicationUserRepository){
        this.quizRepository = quizRepository;
        this.userAnswerService = userAnswerService;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    @Transactional
    public Quiz create(Quiz quiz) throws AppException {
        quiz.getAnswers().forEach(answer -> answer.setQuiz(quiz));

        Optional<User> creator = this.applicationUserRepository.findById(quiz.getCreator().getId());

        if(!creator.isPresent()) {
            AppUtils.throwAndLogException(new IllegalOperationException(
                    String.format("Cannot create quiz because the quiz creator (%s) doesn't exist in DB",
                            quiz.getCreator().getId())));
        }

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
    public void update(Quiz quiz) throws AppException {
        if(quiz == null) {
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot update quiz because it is not defined"));
        }

        if(quiz.getId() == null || quiz.getId().equals("")){
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot update quiz without id"));
        }

        Optional<Quiz> quizFromDBOptional =
                this.quizRepository.findById(quiz.getId());

        if (!quizFromDBOptional.isPresent()){
            AppUtils.throwAndLogException(
                    new QuizNotFoundException("Cannot update quiz because it is not found in DB"));
        }

        this.quizRepository.save(quiz);
    }

    @Override
    @Transactional
    public void delete(String id) throws AppException {
        Optional<Quiz> quizOptional = this.quizRepository.findById(id);
        if(!quizOptional.isPresent()){
            AppUtils.throwAndLogException(
                    new QuizNotFoundException(String.format(
                            "Cannot remove quiz %s because it doesn't exist", id)));
        }

        this.quizRepository.delete(quizOptional.get());
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
