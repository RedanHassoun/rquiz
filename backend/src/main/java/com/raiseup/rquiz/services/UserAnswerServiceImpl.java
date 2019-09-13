package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AnswerAlreadyExistException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.User;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;
import com.raiseup.rquiz.repo.ApplicationUserRepository;
import com.raiseup.rquiz.repo.UserAnswerRepository;
import com.raiseup.rquiz.repo.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserAnswerServiceImpl implements UserAnswerService {
    private Logger logger = LoggerFactory.getLogger(UserAnswerServiceImpl.class);
    private UserAnswerRepository userAnswerRepository;
    private QuizRepository quizRepository;
    private ApplicationUserRepository applicationUserRepository;

    public UserAnswerServiceImpl(UserAnswerRepository userAnswerRepository,
                                 QuizRepository quizRepository,
                                 ApplicationUserRepository applicationUserRepository){
        this.userAnswerRepository = userAnswerRepository;
        this.quizRepository = quizRepository;
        this.applicationUserRepository = applicationUserRepository;
    }

    @Override
    public UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer)
                                                     throws QuizNotFoundException,
                                                            UserNotFoundException,
                                                            AnswerAlreadyExistException{
        if(quizId == null || userId == null || quizAnswer == null){
            final String errorMsg = String.format("Bad input: quizId=%s, userId=%s, userAnswer=%s",
                                            quizId,
                                            userId,
                                            quizAnswer.toString());
            this.logger.error(errorMsg);
            throw new NullPointerException(errorMsg);
        }

        Optional<UserAnswer> ans = this.userAnswerRepository.find(quizId, userId);
        if(ans.isPresent()){
            throw new AnswerAlreadyExistException("Answer already exist");
        }

        UserAnswer userAnswer = new UserAnswer();

        userAnswer.setQuizAnswer(quizAnswer);

        Optional<Quiz> quiz = this.quizRepository.findById(quizId);
        if(!quiz.isPresent()){
            final String errorMsg = String.format("Quiz %s was not found", quizId);
            this.logger.error(errorMsg);
            throw new QuizNotFoundException(errorMsg);
        }

        userAnswer.setQuiz(quiz.get());

        Optional<User> user = this.applicationUserRepository.findById(userId);
        if(!user.isPresent()){
            final String errorMsg = String.format("user %s was not found", userId);
            this.logger.error(errorMsg);
            throw new UserNotFoundException(errorMsg);
        }

        userAnswer.setUser(user.get());

        return this.userAnswerRepository.save(userAnswer);
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
}
