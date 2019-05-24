package com.example.demo.services;

import com.example.demo.models.ApplicationUser;
import java.util.Collection;
import java.util.Optional;

public interface UserService {
    ApplicationUser create (ApplicationUser user);
    Optional<ApplicationUser> read (String id);
    Collection<ApplicationUser> readAll ();
    Collection<ApplicationUser> readAll (int size, int page);
    void update (ApplicationUser dummy);
    void delete (String id);
}
