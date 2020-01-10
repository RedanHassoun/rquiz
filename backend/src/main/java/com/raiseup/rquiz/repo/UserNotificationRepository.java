package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface UserNotificationRepository extends JpaRepository<UserNotification, String> {
    @Query("SELECT n FROM UserNotification AS n WHERE n.targetUser.id = :targetUserId")
    List<UserNotification> findForUser(@Param("targetUserId") String targetUserId);

    @Query("SELECT n FROM UserNotification AS n WHERE n.targetUser.id = :targetUserId AND n.seen = :seen")
    List<UserNotification> findForUser(@Param("targetUserId") String targetUserId, @Param("seen") Boolean seen);
}
