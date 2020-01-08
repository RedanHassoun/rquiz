package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserNotificationRepository extends JpaRepository<UserNotification, String> {
}
