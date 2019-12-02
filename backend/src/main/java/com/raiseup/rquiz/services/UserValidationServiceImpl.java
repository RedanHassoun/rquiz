package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.RegisterRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UserValidationServiceImpl implements UserValidationService {
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
    public String buildValidationMessage(List<String> validations) {
        if(validations == null){
            throw new NullPointerException("validations list cannot be null");
        }

        return "Validation failed. errors: " +
                String.join(" , ", validations);
    }
}
