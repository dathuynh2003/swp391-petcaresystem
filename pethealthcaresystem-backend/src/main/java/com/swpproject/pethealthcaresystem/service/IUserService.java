package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;

import java.util.List;

public interface IUserService {
    public String createUser(User newUser);
    public User getUserByEmail(User user);
    public User validateLogin(User user);
    public List<User> getVets();
}
