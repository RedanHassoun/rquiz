package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseDto;
import com.raiseup.rquiz.models.QuizAnswerDto;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.UserDto;
import org.springframework.stereotype.Service;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

@Service
public class QuizValidationServiceImpl extends ValidationServiceImpl implements QuizValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateQuiz(QuizDto quiz) {
        Set<ConstraintViolation<BaseDto>> violations = validator.validate(quiz);
        final List<String> validations = new ArrayList<>();

        if(violations != null && violations.size() > 0) {
            for (ConstraintViolation<BaseDto> violation : violations) {
                validations.add(violation.getMessage());
            }
            return Optional.of(validations);
        }

        for(QuizAnswerDto answer: quiz.getAnswers()){
            violations = validator.validate(answer);
            if(violations != null && violations.size() > 0) {
                for (ConstraintViolation<BaseDto> violation : violations) {
                    validations.add(violation.getMessage());
                }
                return Optional.of(validations);
            }
        }

        if(quiz.getAnswers().size() < 2) {
            validations.add("The quiz should have at least two answers");
        }

        if(!this.hasOneCorrectAnswer(quiz)){
            validations.add("Quiz must have one correct answer");
        }

        if(!quiz.getIsPublic() && (quiz.getAssignedUsers() == null ||
                quiz.getAssignedUsers().size() == 0)){
            validations.add("Non-public quiz should be assigned at least to one user");
        }

        if (quiz.getAssignedUsers() != null) {
            for(UserDto user : quiz.getAssignedUsers()){
                if (quiz.getCreator().getId().equals(user.getId())) {
                    validations.add("You cannot assign a quiz to yourself");
                }
            }
        }

        if (validations.size() > 0) {
            return Optional.of(validations);
        }
        return Optional.empty();
    }

    public Optional<List<String>> validateUserAnswer(QuizAnswerDto quizAnswer, String quizId){
        if(quizId == null){
            return Optional.of(Collections.singletonList("Quiz id cannot be null"));
        }

        if(quizAnswer == null){
            return Optional.of(Collections.singletonList("Quiz answer cannot be null"));
        }

        return this.validateObject(quizAnswer);
    }

    private boolean hasOneCorrectAnswer(QuizDto quiz){
        Iterator answersIterator = quiz.getAnswers().iterator();

        int correctCount = 0;
        while(answersIterator.hasNext()){
            QuizAnswerDto q = (QuizAnswerDto) answersIterator.next();
            if(q.getIsCorrect()){
                correctCount++;
            }
        }

        return correctCount == 1;
    }
}
