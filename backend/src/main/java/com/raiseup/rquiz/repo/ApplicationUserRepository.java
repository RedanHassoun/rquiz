package com.raiseup.rquiz.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.raiseup.rquiz.models.ApplicationUser;

public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {
    ApplicationUser findByUsername(String username);
    ApplicationUser findById(String id);
}