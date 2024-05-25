package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    @Override
    public User createUser(User newUser){
        User user = new User();

        if(userRepository.existsByEmail(newUser.getEmail())) {
            return null;
        }

        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setFull_name(newUser.getFull_name());
        user.setPhone_number(newUser.getPhone_number());
        user.setAddress(newUser.getAddress());
        user.setRole_id(1);
        user.setAvatar("");
        user.setGender(newUser.getGender());
        user.setStatus(true);
        user.setDob(newUser.getDob());


        return userRepository.save(user);
    }
    @Override
    public User getUserByEmail(User user){
        User existUser = userRepository.findByEmail(user.getEmail());
        if (existUser != null && existUser.getPassword().equals(user.getPassword())) {
            return existUser;
        }
        return null;
    }
}
