package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.MailService;
import com.swpproject.pethealthcaresystem.service.UserService;
import com.swpproject.pethealthcaresystem.service.VerifyCodeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private MailService mailService;
    @Autowired
    private VerifyCodeService verifyCodeService;

    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        if (userService.createUser(newUser).equals("Verification email sent")) {
            String subject = "Verify your email";
            String code = verifyCodeService.generateVerifyCode(newUser.getEmail());
            String body = "Your verification code: " + code;
            mailService.sendMail(newUser.getEmail(),subject,body);
        }
        return userService.createUser(newUser);
    }

    @PostMapping("/verify/{email}/{verifyCode}")
    public String verifyCode(@PathVariable String email, @PathVariable String verifyCode) {
        if(userService.verifyUser(email,verifyCode)) {
            return "Email verify successfully";
        }
        return "Email verify failed";
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

    @GetMapping("/vets")
    public List<User> getVets() {
        return userService.getVets();
    }
}
