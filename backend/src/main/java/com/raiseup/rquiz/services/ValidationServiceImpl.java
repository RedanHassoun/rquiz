package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseModel;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.QuizAnswer;
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
            List<String> validations = new ArrayList<>();
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
            List<String> validations = new ArrayList<>();
            for (ConstraintViolation<BaseModel> violation : violations) {
                validations.add(violation.getMessage());
            }
            return Optional.of(validations);
        }

        for(QuizAnswer answer: quiz.getAnswers()){
            violations = validator.validate(answer);
            if(violations != null && violations.size() > 0) {
                List<String> validations = new ArrayList<>();
                for (ConstraintViolation<BaseModel> violation : violations) {
                    validations.add(violation.getMessage());
                }
                return Optional.of(validations);
            }
        }

        if(!this.hasOneCorrectAnswer(quiz)){
            List<String> validations = new ArrayList<>();
            validations.add("Quiz must have one correct answer");
            return Optional.of(validations);
        }

        return Optional.empty();
    }

    @Override
    public String buildValidationMessage(List<String> validations) {
        if(validations == null){
            throw new NullPointerException("validations list cannot be null");
        }
        StringBuilder sp = new StringBuilder();
        sp.append("Validation failed. errors: ");
        sp.append(String.join(" , ", validations));
        return sp.toString();
    }

    private boolean hasOneCorrectAnswer(Quiz quiz){
        Object[] l = Arrays.stream(quiz.getAnswers().toArray())
                        .filter(q -> ((QuizAnswer)q).getIsCorrect())
                    .toArray();
        if(l == null){
            return false;
        }

        if(l.length != 1){
            return false;
        }
        return true;
    }
}
