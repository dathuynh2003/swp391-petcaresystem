package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.common.ResponseData;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.MailService;
import com.swpproject.pethealthcaresystem.service.UserService;
import com.swpproject.pethealthcaresystem.service.VerifyCodeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
        String result = userService.createUser(newUser);
        if (result.equals("Verification email sent")) {
            String subject = "Verify your email";
            String code = verifyCodeService.generateVerifyCode(newUser.getEmail());
            String body = "Your verification code: " + code;
            mailService.sendMail(newUser.getEmail(), subject, body);
        }
        return result;
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

    @GetMapping("/get-users-by-id/{roleId}")
    public ResponseEntity<ResponseData<Page<User>>> getUsersByRoleId(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @PathVariable int roleId) {

        try {
            Page<User> users;
            if (roleId == 0) {
                users = userService.getAllUsers(pageNo, pageSize); // Assume this method exists
            } else {
                users = userService.getAllUsersByRoleId(pageNo, pageSize, roleId);
            }
            ResponseData<Page<User>> responseData = new ResponseData<>();
            responseData.setData(users);
            responseData.setStatusCode(HttpStatus.OK.value());

            return new ResponseEntity<>(responseData, HttpStatus.OK);

        } catch (Exception e) {
            ResponseData<Page<User>> responseData = new ResponseData<>();
            responseData.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseData.setErrorMessage("Failed to retrieve users: " + e.getMessage());

            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
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
        System.out.println(curUser);
        try {
            if (curUser == null) {
                throw new Exception("You need login first");
            }
        } catch (Exception e) {
            return null;
        }
        return userService.getUserByEmail(curUser);
    }
    @GetMapping("/me")
    public ResponseEntity<ResponseData> getMe(HttpSession session) {
        try {
            ResponseData<User> responseData = new ResponseData<>();
            User curUser = (User) session.getAttribute("user");
            if(curUser == null){
                throw new Exception("You need login first");
            }
            responseData.setData(curUser);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }catch (Exception e){
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(500);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public Map<String, Object> getVets(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            List<User> vets = userService.getVets();
            response.put("vets", vets);
            response.put("message", "Successfully");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
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

    @PostMapping("/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return new ResponseEntity<>("User not logged in", HttpStatus.UNAUTHORIZED);
        }

        try {
            String avatarUrl = userService.saveAvatar(file, currentUser.getUserId());
            return new ResponseEntity<>(avatarUrl, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("find-user-with-email")
    public ResponseEntity<ResponseData> findUserWithEmail(@RequestParam String email) {
        try {
            User selectedUser = userService.findUserByEmail(email);
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setData(selectedUser);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);

        }catch (Exception e){
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(500);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
