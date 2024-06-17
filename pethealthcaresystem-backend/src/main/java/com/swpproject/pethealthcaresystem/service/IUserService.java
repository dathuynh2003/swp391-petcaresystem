package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;
import jakarta.transaction.Transactional;

import java.util.List;

public interface IUserService {
    public String createUser(User newUser);
    public User getUserByEmail(User user);
    public User validateLogin(User user);
    public boolean verifyUser(String email, String code);
    public List<User> getVets();

    @Transactional
    User createUserByAdmin(User newUser);

    public User updateUser(String email, User newUser);
    public List<User> getAllUsersByRoleId(int roleId);
    public User deleteUser(int id);
    User updateUser(User newUser, int id);
    User getUserById(int id);
    @Transactional
    User createUserGoogle(User newUser);

    @Transactional
    User createAnonymousUser(String phoneNumber, String fullName, String gender);
}
