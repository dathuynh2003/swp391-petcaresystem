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

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class UserController {
    static final String SUBJECT = "Verify your email";
    static final String BODY = "Your verification code: ";
    static final String EMAIL_VERIFIED = "Email verify successfully";
    static final String EMAIL_VERIFIED_FAILED = "Email verify failed";

    @Autowired
    private UserService userService;
    @Autowired
    private MailService mailService;
    @Autowired
    private VerifyCodeService verifyCodeService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> register(@RequestBody User newUser) {
        ResponseData<String> responseData = new ResponseData<>();
        try {
            String result = userService.createUser(newUser);
            if (result.equals(UserService.SUCCESSFUL_STATUS)) {
                String code = verifyCodeService.generateVerifyCode(newUser.getEmail());
                mailService.sendMail(newUser.getEmail(), SUBJECT, BODY + code);
                responseData.setData(result);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            } else if(result.equals(UserService.DUPLICATE_EMAIL)
                    || result.equals(UserService.INVALID_EMAIL)
                    || result.equals(UserService.DUPLICATE_PHONE_NUMBER)) {
                responseData.setData(result);
                responseData.setStatusCode(200);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            responseData.setErrorMessage(e.getMessage());
            responseData.setStatusCode(500);
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/create-user-by-admin", consumes = "multipart/form-data")
    public ResponseEntity<ResponseData> createUserByAdmin(
            @RequestPart("user") User user,
            @RequestPart("certificationImages") List<MultipartFile> certificationImages) {
        try {
            User newUser = userService.createUserByAdmin(user, certificationImages);
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setData(newUser);
            responseData.setStatusCode(201);
            return new ResponseEntity<>(responseData, HttpStatus.CREATED);
        } catch (IOException e) {
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(500);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
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
            return EMAIL_VERIFIED;
        }
        return EMAIL_VERIFIED_FAILED;
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
            response.put("message", "Invalid username, password, or account is inactive."); // Add message
        }
        return response;
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseData> logout(HttpSession session) {
        ResponseData<Boolean> responseData = new ResponseData<>();
        try{
            if(session != null){
                session.invalidate();
                responseData.setStatusCode(200);
                responseData.setData(true);
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            }
            responseData.setData(false);
            return new ResponseEntity<>(responseData, HttpStatus.UNAUTHORIZED);
        }catch (Exception e){
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getuser")
    public User getUser(HttpSession session) {
        User curUser = (User) session.getAttribute("user");
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
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            responseData.setData(curUser);
            responseData.setStatusCode(200);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
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
    public Map<String, Object> updateUser(@RequestBody User newUserProfile, HttpSession session) throws Exception {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser != null) {
                session.setAttribute("user", curUser);
                response.put("user", userService.updateUser(curUser.getEmail(), newUserProfile));
                response.put("message", "Successfully");
            } else {
                throw new Exception("You need login first");
            }
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
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

        } catch (Exception e) {
            ResponseData<User> responseData = new ResponseData<>();
            responseData.setStatusCode(500);
            responseData.setErrorMessage(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllUsers")
    public Map<String, Object> getAllUsers(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (session.getAttribute("user") == null) {
                throw new Exception("You need login first");
            }
            List<User> listUser = userService.getAll();
            response.put("users", listUser);
            response.put("message", "Successfully");

        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;

    }
}
