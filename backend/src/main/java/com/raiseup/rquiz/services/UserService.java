package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.db.User;
import java.util.Collection;
import java.util.Optional;

public interface UserService {
    User create (User user) throws AppException;
    Optional<User> read(String id) throws AppException;
    Collection<User> readAll ();
    Collection<User> readAll (Integer size, Integer page);
    Collection<User> search (String searchQuery, Integer size, Integer page) throws AppException;
    void update (User user) throws AppException;
    void delete (String id);
}
