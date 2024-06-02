package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;

import java.util.List;

public interface IUserService {
    public String createUser(User newUser);
    public User getUserByEmail(User user);
    public User validateLogin(User user);
    public boolean verifyUser(String email, String code);
    public List<User> getVets();
    public User updateUser(String email, User newUser);

}
