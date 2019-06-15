package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseModel;
import org.springframework.stereotype.Service;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ValidationServiceImpl implements ValidationService {
    private ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private Validator validator = factory.getValidator();

    @Override
    public Optional<List<String>> validateBean(BaseModel beanObject) {
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
    public String buildValidationMessage(List<String> validations) {
        if(validations == null){
            throw new NullPointerException("validations list cannot be null");
        }
        StringBuilder sp = new StringBuilder();
        sp.append("Validation failed. errors: ");
        sp.append(String.join(" , ", validations));
        return sp.toString();
    }
}
