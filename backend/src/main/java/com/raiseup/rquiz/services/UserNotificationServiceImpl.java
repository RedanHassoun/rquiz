package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.models.db.UserNotification;
import com.raiseup.rquiz.repo.UserNotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserNotificationServiceImpl implements UserNotificationService {
    private Logger logger = LoggerFactory.getLogger(UserNotificationServiceImpl.class);

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

    @Override
    public Optional<UserNotification> update(UserNotification userNotification) throws AppException {
        if (userNotification.getId() == null) {
            throw new IllegalOperationException("Cannot update notification because the ID is not defined");
        }
        Optional<UserNotification> userNotificationFromDBOpt = this.userNotificationRepository
                .findById(userNotification.getId());

        if (!userNotificationFromDBOpt.isPresent()) {
            throw new IllegalOperationException(
                    String.format("Cannot update notification %s because it is not found in DB", userNotification.getId()));
        }
        UserNotification userNotificationFromDB = userNotificationFromDBOpt.get();

        userNotificationFromDB.setSeen(userNotification.getSeen());
        userNotificationFromDB = this.userNotificationRepository.save(userNotificationFromDB);

        this.logger.debug(String.format("Updated notification %s", userNotificationFromDB.getId()));

        return Optional.of(userNotificationFromDB);
    }

    @Override
    public List<UserNotification> readAll() {
        return this.userNotificationRepository.findAll();
    }

    @Override
    public List<UserNotification> readAllForUser(String targetUserId, Boolean seen) throws AppException {
        if (targetUserId == null) {
            throw new IllegalOperationException("Cannot get notifications because user is not defined");
        }

        if (seen == null) {
            this.logger.debug(String.format("Reading all notifications for user: %s", targetUserId));
            return this.userNotificationRepository.findForUser(targetUserId);
        }

        this.logger.debug(String.format("Reading notifications for user: %s with seen=%b", targetUserId, seen));
        return this.userNotificationRepository.findForUser(targetUserId, seen);
    }
}
