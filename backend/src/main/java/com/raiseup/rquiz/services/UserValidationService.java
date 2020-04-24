package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.RegisterRequest;
import java.util.List;
import java.util.Optional;

public interface UserValidationService extends ValidationService {
    Optional<List<String>> validateRegisterRequest(RegisterRequest registerRequest);
    Optional<List<String>> validateLoginRequest(RegisterRequest registerRequest);
}
