package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseModel;

import java.util.List;
import java.util.Optional;

public interface ValidationService {
    Optional<List<String>> validateBean(BaseModel beanObject);
    String buildValidationMessage(List<String> validations);
}
