package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IUserService {
    public String createUser(User newUser);
    public User getUserByEmail(User user);
    public User validateLogin(User user);
    public boolean verifyUser(String email, String code);
    public List<User> getVets();

    @Transactional

    public User updateUser(String email, User newUser) throws Exception;

    @Transactional
    User createUserByAdmin(User newUser, List<MultipartFile> certificationImageFiles) throws IOException;

    public Page<User> getAllUsersByRoleId(int pageNo, int pageSize, int roleId);
    public User deleteUser(int id);
    User updateUser(User newUser, int id);
    User getUserById(int id);
    @Transactional
    User createUserGoogle(User newUser);
    User findUserByEmail(String email);
    @Transactional
//    User createAnonymousUser(String phoneNumber, String fullName, String gender);
    Page<User> getAllUsers(int pageNo, int pageSize);
    User createOrGetAnonymousUser(String phoneNumber, String fullName);

    String saveAvatar(MultipartFile file, int userId) throws IOException;
    public List<User> getAll();
}
