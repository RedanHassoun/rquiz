package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.RegisterRequest;
import com.raiseup.rquiz.models.UpdateUserRequestDto;
import com.raiseup.rquiz.models.db.BaseModel;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

@Service
public class UserValidationServiceImpl implements UserValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateRegisterRequest(RegisterRequest registerRequest) {
        List<String> validationsList = new ArrayList<>();
        if(registerRequest == null) {
            return Optional.of(Collections.singletonList("Cannot register because the request is not defined"));
        }

        if(registerRequest.getPassword() == null || registerRequest.getUsername() == null) {
            return Optional.of(Collections.singletonList("Cannot register, username and password must be defined"));
        }
        return Optional.empty();
    }

    @Override
    public Optional<List<String>> validateLoginRequest(RegisterRequest registerRequest) {
        if(registerRequest == null) {
            return Optional.of(Collections.singletonList("Cannot login because the request is not defined"));
        }

        if(registerRequest.getPassword() == null) {
            return Optional.of(Collections.singletonList("Cannot login, the password must be defined"));
        }

        if((registerRequest.getUsername() == null) && (registerRequest.getEmail() == null)) {
            return Optional.of(Collections.singletonList("Cannot login, username\\email must be provided"));
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
}
