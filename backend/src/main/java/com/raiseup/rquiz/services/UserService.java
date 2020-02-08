package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.db.User;
import java.util.Collection;
import java.util.Optional;

public interface UserService {
    User create (User user) throws AppException;
    Optional<User> read(String id) throws AppException;
    Collection<User> readAll ();
    Collection<User> readAll (int size, int page);
    void update (User user) throws AppException;
    void delete (String id);
}
