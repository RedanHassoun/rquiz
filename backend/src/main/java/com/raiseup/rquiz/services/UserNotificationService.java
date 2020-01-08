package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.db.UserNotification;
import java.util.Optional;

public interface UserNotificationService {
    Optional<UserNotification> save(UserNotification userNotification) throws AppException;
}
