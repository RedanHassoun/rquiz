package com.raiseup.rquiz.repo;

import com.raiseup.rquiz.models.db.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface ApplicationUserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByUsername(String username);
    User findByEmail(String email);
    Optional<User> findById(String id);
}
