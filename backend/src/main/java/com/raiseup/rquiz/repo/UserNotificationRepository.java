package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserNotificationRepository extends JpaRepository<UserNotification, String> {
    @Query("SELECT n FROM UserNotification AS n WHERE n.targetUser.id = :targetUserId ORDER BY n.updatedAt DESC")
    List<UserNotification> findForUser(@Param("targetUserId") String targetUserId);

    @Query("SELECT n FROM UserNotification AS n WHERE n.targetUser.id = :targetUserId AND n.seen = :seen ORDER BY n.updatedAt DESC")
    List<UserNotification> findForUser(@Param("targetUserId") String targetUserId, @Param("seen") Boolean seen);

    @Transactional
    @Modifying
    @Query("UPDATE UserNotification n SET n.seen = :seen WHERE n.seen <> :seen AND n.targetUser.id = :targetUserId")
    int updateAllUserNotifications(@Param("targetUserId") String targetUserId, @Param("seen") Boolean seen);
}
