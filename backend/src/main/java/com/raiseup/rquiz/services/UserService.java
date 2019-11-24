package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.db.User;
import java.util.Collection;
import java.util.Optional;

public interface UserService {
    User create (User user);
    Optional<User> read (String id);
    Collection<User> readAll ();
    Collection<User> readAll (int size, int page);
    void update (User dummy);
    void delete (String id);
}
