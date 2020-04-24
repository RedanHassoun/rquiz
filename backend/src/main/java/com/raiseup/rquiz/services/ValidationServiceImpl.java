package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseDto;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

public class ValidationServiceImpl implements ValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateObject(Object beanObject) {
        Set<ConstraintViolation<Object>> violations = validator.validate(beanObject);

        if(violations != null && violations.size() > 0) {
            final List<String> validations = new ArrayList<>();
            for (ConstraintViolation<Object> violation : violations) {
                validations.add(violation.getMessage());
            }
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
}
