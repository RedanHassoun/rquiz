package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.RegisterRequest;
import org.springframework.stereotype.Service;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

@Service
public class UserValidationServiceImpl extends ValidationServiceImpl implements UserValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateRegisterRequest(RegisterRequest registerRequest) {
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
}
