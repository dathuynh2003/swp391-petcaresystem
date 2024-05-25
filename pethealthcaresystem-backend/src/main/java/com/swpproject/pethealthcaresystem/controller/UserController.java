package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User newUser) {
        return userService.createUser(newUser);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.getUserByEmail(user);
    }

}
