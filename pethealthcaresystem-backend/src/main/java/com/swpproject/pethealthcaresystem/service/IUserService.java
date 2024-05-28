package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;

public interface IUserService {
    public User createUser(User newUser);
    public User getUserByEmail(User user);
    public User getUserByEmailAndPassword(User user);
}
