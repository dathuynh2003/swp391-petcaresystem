package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            return null;
        }

        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(1);
        user.setAvatar("");
        user.setGender(newUser.getGender());
        user.setStatus(true);
        user.setDob(newUser.getDob());


        userRepository.save(user);
        return user;
    }

    @Override
    public User getUserByEmailAndPassword(User user){
        User existUser = userRepository.findByEmail(user.getEmail());
        if (existUser != null && existUser.getPassword().equals(user.getPassword())) {
            return existUser;
        }
        return null;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
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
