package com.raiseup.rquiz.services;

import com.raiseup.rquiz.common.AppConstants;
import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.*;
import com.raiseup.rquiz.models.db.User;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.UserAnswer;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.QuizAnswerRepository;
import com.raiseup.rquiz.repo.UserAnswerRepository;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserAnswerServiceImpl implements UserAnswerService {
    private Logger logger = LoggerFactory.getLogger(UserAnswerServiceImpl.class);
    private UserAnswerRepository userAnswerRepository;
    private QuizRepository quizRepository;
    private ApplicationUserRepository applicationUserRepository;
    private QuizAnswerRepository quizAnswerRepository;

    public UserAnswerServiceImpl(UserAnswerRepository userAnswerRepository,
                                 QuizRepository quizRepository,
                                 ApplicationUserRepository applicationUserRepository,
                                 QuizAnswerRepository quizAnswerRepository){
        this.userAnswerRepository = userAnswerRepository;
        this.quizRepository = quizRepository;
        this.applicationUserRepository = applicationUserRepository;
        this.quizAnswerRepository = quizAnswerRepository;
    }

    @Override
    @Transactional
    public UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer)
                                                     throws AppException {
        this.logger.debug(String.format("Adding answer for quiz: %s, user id: %s", quizId, userId));
        this.validateUserAnswerDataForCreation(quizId, userId, quizAnswer);

        Optional<QuizAnswer> quizAnswerOps = this.quizAnswerRepository.findById(quizAnswer.getId());
        if (!quizAnswerOps.isPresent()){
            throw new IllegalOperationException(
                    String.format("Cannot add answer %s for quiz %s because the requested quiz answer doesn't exist",
                            quizAnswer.getId(), quizId));
        }
        final UserAnswer userAnswerToCreate = new UserAnswer();
        userAnswerToCreate.setQuizAnswer(quizAnswerOps.get());

        Optional<User> user = this.applicationUserRepository.findById(userId);
        if(!user.isPresent()){
            AppUtils.throwAndLogException(
                    new UserNotFoundException(String.format("user %s was not found", userId)));
        }

        userAnswerToCreate.setUser(user.get());
        UserAnswer userAnswerFromDB = this.userAnswerRepository.save(userAnswerToCreate);
        this.logger.debug(String.format("Created user answer: %s", userAnswerFromDB.getId()));
        return userAnswerFromDB;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAnswer> getUserAnswersForQuiz(String quizId, Integer page, Integer size) {
        if(quizId == null){
            throw new IllegalArgumentException("quiz id cannot be null");
        }

        this.logger.debug(String.format("Getting answers list for quiz : %s", quizId));

        if (page != null && size != null) {
            this.logger.debug(String.format("Returning page: %d , size: %d", page, size));
            Pageable pageable = PageRequest.of(
                    page, size, Sort.Direction.DESC, AppConstants.DBConsts.CREATED_AT);
            return this.userAnswerRepository.findByQuizId(quizId, pageable);
        }

        this.logger.debug("Returning all answers list");
        return this.userAnswerRepository.findByQuizId(quizId);
    }

    @Override
    public Optional<Integer> getCorrectCount(List<UserAnswer> userAnswers) {
        int correctCount = 0;

        for(UserAnswer ans : userAnswers){
            if(ans.getQuizAnswer().getIsCorrect()){
                correctCount++;
            }
        }

        return Optional.of(correctCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserAnswer> getQuizAnswerForUser(String quizId, String userId) {
        if (userId == null || quizId == null) {
            final String errorMessage = String.format(
                    "Cannot get quiz answer for user %s, userId and quizId must be defined", userId);
            this.logger.error(errorMessage);
            throw new IllegalArgumentException(errorMessage);
        }

        List<UserAnswer> userAnswers = this.userAnswerRepository.find(quizId, userId);
        if(userAnswers.size() > 0) {
            if(userAnswers.size() > 1) {
                this.logger.error(String.format(
                        "Found more than one answer for quiz %s and user %s, looks like there is a corruption in the database",
                        quizId, userId));
            }

            return Optional.of(userAnswers.get(0));
        }

        return Optional.empty();
    }

    private void validateUserAnswerDataForCreation(String quizId, String userId, QuizAnswer quizAnswer) throws AppException {
        if(quizId == null || userId == null || quizAnswer == null) {
            final String errorMsg = String.format("Bad input: quizId=%s, userId=%s, userAnswer=%s",
                    quizId,
                    userId,
                    AppUtils.toStringNullSafe(quizAnswer));
            this.logger.error(errorMsg);
            throw new NullPointerException(errorMsg);
        }

        List<UserAnswer> ansList = this.userAnswerRepository.find(quizId, userId);
        if(ansList.size() > 0){
            if(ansList.size() > 1) {
                this.logger.error(String.format(
                        "Found more than one answer for quiz %s and user %s, looks like there is a corruption in the database",
                        quizId, userId));
            }
            throw new AnswerAlreadyExistException("Answer already exist");
        }

        Optional<Quiz> quiz = this.quizRepository.findById(quizId);
        if(!quiz.isPresent()){
            AppUtils.throwAndLogException(
                    new QuizNotFoundException(
                            String.format("Quiz %s was not found", quizId)));
        }
        this.validateAnswerIsSuitableForQuiz(quiz.get(), quizAnswer, userId);
    }

    private void validateAnswerIsSuitableForQuiz(Quiz quiz, QuizAnswer quizAnswer,
                                            String userId) throws AppException {
        Set<QuizAnswer> quizAnswerSet = quiz.getAnswers();
        if(!quizAnswerSet.contains(quizAnswer)) {
            AppUtils.throwAndLogException(
                    new IllegalOperationException(
                            String.format("Cannot perform operation because answer %s is not part of quiz %s",
                                    quizAnswer.getId(), quiz.getId())));
        }

        if(quiz.getCreator().getId().equals(userId)) {
            AppUtils.throwAndLogException(
                    new IllegalOperationException("Cannot solve an owned quiz"));
        }
    }
}
