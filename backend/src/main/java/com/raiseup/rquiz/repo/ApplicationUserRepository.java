package com.raiseup.rquiz.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.raiseup.rquiz.models.ApplicationUser;

import java.util.Optional;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    ApplicationUser findByUsername(String username);
    Optional<ApplicationUser> findById(String id);
}