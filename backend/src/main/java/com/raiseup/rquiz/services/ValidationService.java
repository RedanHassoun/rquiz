package com.raiseup.rquiz.services;

import java.util.List;
import java.util.Optional;

public interface ValidationService {
    Optional<List<String>> validateObject(Object beanObject);
    Optional<String> validateString(String toValidate, String name);
    String buildValidationMessage(List<String> validations);
}
