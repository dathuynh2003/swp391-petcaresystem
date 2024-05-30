package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User newUser) {
        try{
            return new ResponseEntity<>(userService.createUser(newUser).toString(), HttpStatus.CREATED);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        User curUser = userService.validateLogin(user);
        if (curUser != null) {
            session.setAttribute("user", curUser);
            response.put("isSuccess", "true");
            response .put("user", curUser);
        } else {
            response.put("isSuccess", "false");
        }
        return response;
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
