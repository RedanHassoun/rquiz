package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.db.UserNotification;
import java.util.List;
import java.util.Optional;

public interface UserNotificationService {
    Optional<UserNotification> save(UserNotification userNotification) throws AppException;
    Optional<UserNotification> update(UserNotification userNotification) throws AppException;
    List<UserNotification> readAll() throws AppException;
    List<UserNotification> readAllForUser(String targetUserId, Boolean seen) throws AppException;
}
