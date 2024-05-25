package com.swpproject.pethealthcaresystem.Service;

import com.swpproject.pethealthcaresystem.Model.user;
import com.swpproject.pethealthcaresystem.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public user createUser(user newUser){
        user user = new user();

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

    public user getUserByEmail(user user){
        user existUser = userRepository.findByEmail(user.getEmail());
        if (existUser != null && existUser.getPassword().equals(user.getPassword())) {
            return existUser;
        }
        return null;
    }
}
