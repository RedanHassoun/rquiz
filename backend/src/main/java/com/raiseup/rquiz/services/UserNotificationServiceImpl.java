package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.models.db.UserNotification;
import com.raiseup.rquiz.repo.UserNotificationRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserNotificationServiceImpl implements UserNotificationService {
    private UserNotificationRepository userNotificationRepository;

    public UserNotificationServiceImpl(UserNotificationRepository userNotificationRepository) {
        this.userNotificationRepository = userNotificationRepository;
    }

    @Override
    public Optional<UserNotification> save(UserNotification userNotification) throws AppException {
        if (userNotification == null) {
            throw new IllegalOperationException("Cannot save user notification because it is not defined");
        }

        return Optional.of(this.userNotificationRepository.save(userNotification));
    }
}
