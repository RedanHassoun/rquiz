package com.raiseup.rquiz.services;

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
            throw new IllegalOperationException("TODO");
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
    public List<UserAnswer> getUserAnswersForQuiz(String quizId) {
        if(quizId == null){
            throw new IllegalArgumentException("quiz id cannot be null");
        }

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

    private void validateUserAnswerDataForCreation(String quizId, String userId, QuizAnswer quizAnswer) throws AppException {
        if(quizId == null || userId == null || quizAnswer == null) {
            final String errorMsg = String.format("Bad input: quizId=%s, userId=%s, userAnswer=%s",
                    quizId,
                    userId,
                    AppUtils.toStringNullSafe(quizAnswer));
            this.logger.error(errorMsg);
            throw new NullPointerException(errorMsg);
        }

        Optional<UserAnswer> ans = this.userAnswerRepository.find(quizId, userId);
        if(ans.isPresent()){
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
