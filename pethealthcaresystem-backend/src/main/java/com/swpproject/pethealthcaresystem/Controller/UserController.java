package com.swpproject.pethealthcaresystem.Controller;

import com.swpproject.pethealthcaresystem.Model.user;
import com.swpproject.pethealthcaresystem.Service.UserService;
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
    public user register(@RequestBody user newUser) {
        return userService.createUser(newUser);
    }

    @PostMapping("/login")
    public user login(@RequestBody user user) {
        return userService.getUserByEmail(user);
    }

}
