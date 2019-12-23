package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.RegisterRequest;
import java.util.List;
import java.util.Optional;

public interface UserValidationService {
    Optional<List<String>> validateObject(Object beanObject);
    Optional<List<String>> validateRegisterRequest(RegisterRequest registerRequest);
    String buildValidationMessage(List<String> validations);
}
