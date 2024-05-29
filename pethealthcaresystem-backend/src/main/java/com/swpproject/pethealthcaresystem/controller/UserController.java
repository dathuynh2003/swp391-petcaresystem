package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        return userService.createUser(newUser);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user, HttpSession session) {
        User curUser = userService.getUserByEmailAndPassword(user);
        if (curUser != null) {
            session.setAttribute("user", curUser);
            return "Logged in successfully";
        }
        return "Invalid username or password";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out successfully";
    }

    @GetMapping("/getuser")
    public  User getUser (HttpSession session){
        User curUser = (User) session.getAttribute("user");
        return userService.getUserByEmail(curUser);
    }

}
