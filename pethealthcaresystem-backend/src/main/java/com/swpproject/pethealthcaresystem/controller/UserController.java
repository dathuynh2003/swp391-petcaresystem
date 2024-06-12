package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.MailService;
import com.swpproject.pethealthcaresystem.service.UserService;
import com.swpproject.pethealthcaresystem.service.VerifyCodeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            mailService.sendMail(newUser.getEmail(), subject, body);
        }
        return userService.createUser(newUser);
    }

    @PostMapping("/create-user-by-admin")
    public ResponseEntity<ResponseData> createUserByAdmin(@RequestBody User user) {
        try {
            User newUser = userService.createUserByAdmin(user);
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setData(newUser);
            responseData.setStatusCode(201);
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Error e) {
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(401);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);


        }

    }
    @PostMapping("/register-gg")
    public ResponseEntity<ResponseData> registerWithGG(@RequestBody User user, HttpSession session) {
        try {
            user.setRoleId(1);
            User newUser = userService.createUserGoogle(user);
            session.setAttribute("user", newUser);
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setData(newUser);
            responseData.setStatusCode(201);
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (Error e) {
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(401);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);

        }
    }
    @PutMapping("/update-user-by-admin/{id}")
    public ResponseEntity<ResponseData> updateUserByAdmin(@RequestBody User user, @PathVariable int id) {
        User updateUser = userService.updateUser(user, id);
        if (updateUser == null) {
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(404);
            responseData.setErrorMessage("User not found");
        }
        ResponseData<User> responseData = new ResponseData<>();
        responseData.setData(updateUser);
        responseData.setStatusCode(200);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @PutMapping("/delete-user-by-admin/{id}")
    public ResponseEntity<ResponseData<User>> deleteUserByAdmin(@PathVariable(name = "id") int id) {
        ResponseData<User> responseData = new ResponseData<>();
        try {
            User deletedUser = userService.deleteUser(id);
            if (deletedUser == null) {
                responseData.setStatusCode(404);
                responseData.setErrorMessage("User not found");
                return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);
            }
            responseData.setData(deletedUser);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setStatusCode(500);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-users-by-id")
    public ResponseEntity<ResponseData> getUsersById(@RequestParam("id") int id) {
        try {
            List<User> users = userService.getAllUsersByRoleId(id);
            ResponseData<List<User>> responseData = new ResponseData<>();
            responseData.setData(users);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Error e) {
            ResponseData<List<User>> responseData = new ResponseData<>();
            responseData.setStatusCode(401);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/verify/{email}/{verifyCode}")
    public String verifyCode(@PathVariable String email, @PathVariable String verifyCode) {
        if (userService.verifyUser(email, verifyCode)) {
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
            response.put("user", curUser);
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
    public User getUser(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
        return userService.getUserByEmail(curUser);
    }

    @GetMapping("/get-user-by-id/{id}")
    public ResponseEntity<ResponseData> getUserById(@PathVariable int id) {

        User selectedUser = userService.getUserById(id);
        ResponseData<User> responseData = new ResponseData<>();
        if (selectedUser != null) {
            responseData.setData(selectedUser);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        responseData.setStatusCode(404);
        responseData.setErrorMessage("User not found");
        return new ResponseEntity<>(responseData, HttpStatus.NOT_FOUND);

    }

    @GetMapping("/vets")
    public List<User> getVets() {
        return userService.getVets();
    }

    @PutMapping("/updateuser")
    public User updateUser(@RequestBody User newUserProfile, HttpSession session) throws Exception {
        User curUser = (User) session.getAttribute("user");
        if (curUser != null) {
            session.setAttribute("user", curUser);
           return userService.updateUser(curUser.getEmail(), newUserProfile);
        }
        throw new Exception("You need login first");
    }
}
