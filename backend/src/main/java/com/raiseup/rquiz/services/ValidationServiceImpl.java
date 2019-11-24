package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.BaseModel;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import org.springframework.stereotype.Service;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

@Service
public class ValidationServiceImpl implements ValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateObject(BaseModel beanObject) {
        Set<ConstraintViolation<BaseModel>> violations = validator.validate(beanObject);

        if(violations != null && violations.size() > 0) {
            final List<String> validations = new ArrayList<>();
            for (ConstraintViolation<BaseModel> violation : violations) {
                validations.add(violation.getMessage());
            }
            return Optional.of(validations);
        }

        return Optional.empty();
    }

    @Override
    public Optional<List<String>> validateQuiz(Quiz quiz) {
        Set<ConstraintViolation<BaseModel>> violations = validator.validate(quiz);

        if(violations != null && violations.size() > 0) {
            final List<String> validations = new ArrayList<>();
            for (ConstraintViolation<BaseModel> violation : violations) {
                validations.add(violation.getMessage());
            }
            return Optional.of(validations);
        }

        for(QuizAnswer answer: quiz.getAnswers()){
            violations = validator.validate(answer);
            if(violations != null && violations.size() > 0) {
                final List<String> validations = new ArrayList<>();
                for (ConstraintViolation<BaseModel> violation : violations) {
                    validations.add(violation.getMessage());
                }
                return Optional.of(validations);
            }
        }

        if(!this.hasOneCorrectAnswer(quiz)){
            final List<String> validations = new ArrayList<>();
            validations.add("Quiz must have one correct answer");
            return Optional.of(validations);
        }

        return Optional.empty();
    }

    @Override
    public Optional<String> validateString(String toValidate, String name) {
        if(toValidate == null || toValidate.equals("")){
            final String validation = String.format("%s must have a value", name);
            return Optional.of(validation);
        }

        return Optional.empty();
    }

    @Override
    public String buildValidationMessage(List<String> validations) {
        if(validations == null){
            throw new NullPointerException("validations list cannot be null");
        }

        return "Validation failed. errors: " +
                    String.join(" , ", validations);
    }

    public Optional<List<String>> validateUserAnswer(QuizAnswer quizAnswer, String quizId){
        if(quizId == null){
            return Optional.of(Collections.singletonList("Quiz id cannot be null"));
        }

        if(quizAnswer == null){
            return Optional.of(Collections.singletonList("Quiz answer cannot be null"));
        }

        return this.validateObject(quizAnswer);
    }

    private boolean hasOneCorrectAnswer(Quiz quiz){
        Iterator answersIterator = quiz.getAnswers().iterator();

        int correctCount = 0;
        while(answersIterator.hasNext()){
            QuizAnswer q = (QuizAnswer) answersIterator.next();
            if(q.getIsCorrect()){
                correctCount++;
            }
        }

        return correctCount == 1;
    }
}
