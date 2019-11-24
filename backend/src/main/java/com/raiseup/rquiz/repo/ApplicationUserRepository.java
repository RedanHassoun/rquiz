package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationUserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    Optional<User> findById(String id);
}