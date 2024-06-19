package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.Booking;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;


@Service
public class UserService implements IUserService {

    private final Map<String, User> temporaryStorage = new HashMap<>();

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerifyCodeService verifyCodeService;

    @Transactional
    @Override
    public String createUser(User newUser) {
        User user = userRepository.findByPhoneNumber(newUser.getPhoneNumber());

        if (user == null) {
            user = new User();
        } else if (user.getEmail() != null && userRepository.existsByEmail(newUser.getEmail())) {
            // Nếu tài khoản đã có email và email này đang được sử dụng
            return "Email is already in use";
        } else if (user.getEmail() != null && !user.getEmail().equals(newUser.getEmail())) {
            // Nếu tài khoản đã có email nhưng không trùng với email mới
            return "Phone number is already associated with a different email";
        }

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            return "Email is invalid";
        }

        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(1);
        user.setAvatar("");
        user.setGender(newUser.getGender());
        user.setIsActive(false); // Đặt là không hoạt động cho đến khi xác thực
        user.setDob(newUser.getDob());


        temporaryStorage.put(user.getEmail(), user);

        return "Verification email sent";
    }

    @Override
    public User validateLogin(User user) {
        User existUser = userRepository.findByEmail(user.getEmail());
        if (existUser != null && existUser.getPassword().equals(user.getPassword())) {
            existUser.setPassword("");
            existUser.setVetShiftDetails(null);
            return existUser;
        }
        return null;
    }

    @Override
    public boolean verifyUser(String email, String code) {
        String storedCode = verifyCodeService.getVerifyCode(email);
        if (storedCode != null && storedCode.equals(code)) {
            User user = temporaryStorage.get(email);
            if (user != null) {
                user.setIsActive(true); // Kích hoạt tài khoản sau khi xác thực thành công
                userRepository.save(user);
                temporaryStorage.remove(email);
                verifyCodeService.removeVerifyCode(email);
                return true;
            }
        }
        return false;
    }

    @Override
    public User getUserByEmail(User user) {
        User existUser = userRepository.findByEmail(user.getEmail());
        if (existUser != null) {
            existUser.setPassword("");
            return existUser;
        }
        return null;
    }

    @Override
    public List<User> getVets() {
        List<User> vets = userRepository.findByRoleId(3);
        for (User vet : vets) {
            for (VetShiftDetail vetShiftDetail : vet.getVetShiftDetails()) {
                //Chống lặp vô hạn
                vetShiftDetail.setBookings(null);
            }
        }
        return vets;
    }

    @Override
    public User updateUser(String email, User newUser) {
        User existUser = userRepository.findByEmail(email);
        if (existUser != null && newUser != null) {
            existUser.setFullName(newUser.getFullName());
//            existUser.setEmail(newUser.getEmail());
            existUser.setPhoneNumber(newUser.getPhoneNumber());
            existUser.setAddress(newUser.getAddress());
            existUser.setGender(newUser.getGender());
            existUser.setDob(newUser.getDob());
            return userRepository.save(existUser);
        }
        throw new EntityNotFoundException("User not found");
    }

    @Transactional
    @Override
    public User createUserByAdmin(User newUser) {

        User user = new User();

        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new Error("Email is already in use");

        }

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            throw new Error("Email is invalid");

        }
        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(newUser.getRoleId());
        user.setAvatar("");
        user.setGender(newUser.getGender());
        user.setIsActive(true);
        user.setDob(newUser.getDob());
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsersByRoleId(int roleId) {

        if (roleId == 0) {
            List<User> users = userRepository.findByIsActiveTrue();
            for (User user : users) {
                user.setVetShiftDetails(null);
            }
            return users;
        }
        List<User> users = userRepository.findByRoleId(roleId);
        for (User user : users) {
            user.setVetShiftDetails(null);
        }
        return users;

    }

    public User deleteUser(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User deletedUser = userOptional.get();
            deletedUser.setIsActive(false);
            return userRepository.save(deletedUser);
        } else {
            return null;
        }
    }

    @Override
    public User updateUser(User newUser, int id) {
        User updatedUser = getUserById(id);
        if (updatedUser != null) {
//            updatedUser.setEmail(newUser.getEmail());
//            updatedUser.setPassword(newUser.getPassword());
//            updatedUser.setFullName(newUser.getFullName());
//            updatedUser.setPhoneNumber(newUser.getPhoneNumber());
//            updatedUser.setAddress(newUser.getAddress());
//            updatedUser.setGender(newUser.getGender());
//            updatedUser.setDob(newUser.getDob());
            updatedUser.setIsActive(newUser.getIsActive());
            updatedUser.setRoleId(newUser.getRoleId());
            return userRepository.save(updatedUser);
        }
        return null;
    }

    @Transactional
    @Override
    public User createUserGoogle(User newUser) {

        User user = new User();

        if (userRepository.existsByEmail(newUser.getEmail())) {
            return userRepository.findByEmail(newUser.getEmail());
        }

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            throw new Error("Email is invalid");
        }
        user.setEmail(newUser.getEmail());
        user.setPassword(newUser.getPassword());
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(newUser.getRoleId());
        user.setAvatar("");
        user.setGender(newUser.getGender());
        user.setIsActive(true);
        user.setDob(newUser.getDob());
        return userRepository.save(user);
    }

    @Override
    public User getUserById(int id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Transactional
    @Override
    public User createAnonymousUser(String phoneNumber, String fullName, String gender) {
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new Error("Phone number is already in use");
        }

        User user = User.builder()
                .phoneNumber(phoneNumber)
                .fullName(fullName)
                .gender(gender)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }
}
