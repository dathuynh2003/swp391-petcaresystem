package com.swpproject.pethealthcaresystem.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.swpproject.pethealthcaresystem.model.Certification;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.model.VetShiftDetail;
import com.swpproject.pethealthcaresystem.repository.UserRepository;
import com.swpproject.pethealthcaresystem.utils.SystemUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;


@Service
public class UserService implements IUserService {
    private static final int CUSTOMER_ROLEID = 1;
    public static final String DUPLICATE_EMAIL = "Email is already in use";
    public static final String DUPLICATE_PHONE_NUMBER = "Phone number is already associated with a different email";
    public static final String INVALID_EMAIL = "Email is invalid";
    public static final String SUCCESSFUL_STATUS = "Verification email sent";
    private final Map<String, User> temporaryStorage = new HashMap<>();
    public static final String AVARTAR_DEFAULT = "https://res.cloudinary.com/dinklulzk/image/upload/v1718952303/avatarDefault_vl6wzt.jpg";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerifyCodeService verifyCodeService;
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    @Override
    public String createUser(User newUser) {
        User user = userRepository.findByPhoneNumber(newUser.getPhoneNumber());
        Date now = new Date();
        if (user == null) {
            user = new User();
        } else if (user.getEmail() != null && userRepository.existsByEmail(newUser.getEmail())) {
            // Nếu tài khoản đã có email và email này đang được sử dụng
            return DUPLICATE_EMAIL;
        } else if (user.getEmail() != null && !user.getEmail().equals(newUser.getEmail())) {
            // Nếu tài khoản đã có email nhưng không trùng với email mới
            return DUPLICATE_PHONE_NUMBER;
        }
        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            return INVALID_EMAIL;
        }
        user.setCreatedAt(now);
        user.setEmail(newUser.getEmail());
        user.setPassword(SystemUtils.passwordHash(newUser.getPassword()));
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(1);
        user.setAvatar(AVARTAR_DEFAULT);
        user.setGender(newUser.getGender());
        user.setIsActive(false); // Đặt là không hoạt động cho đến khi xác thực
        user.setDob(newUser.getDob());


        temporaryStorage.put(user.getEmail(), user);

        return SUCCESSFUL_STATUS;
    }

    @Override
    public User validateLogin(User user) {
        User existUser = userRepository.findByEmail(user.getEmail());
        if (existUser == null) {
            return null;
        }
        if (!existUser.getIsActive()) {
            return null;
        }

        String hashedPassword = SystemUtils.passwordHash(user.getPassword());
        int userRoleId = existUser.getRoleId();
        if (userRoleId == CUSTOMER_ROLEID) {
            if (existUser.getPassword().equals(hashedPassword)) {
                existUser.setPassword("");
                existUser.setVetShiftDetails(null);
                return existUser;
            }
        } else {
            if (existUser.getPassword().equals(hashedPassword)) {
                existUser.setPassword("");
                existUser.setVetShiftDetails(null);
                return existUser;
            }
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
    public User updateUser(String email, User newUser) throws Exception {
        User curUser = userRepository.findByEmail(email);
        if (curUser != null && newUser != null) {
            //Kiểm tra sdt này đã tồn tại ở user khác chưa. Nếu có thì throw exception
            User existingUserByPhone = userRepository.findByPhoneNumber(newUser.getPhoneNumber());
            if (existingUserByPhone != null && !existingUserByPhone.equals(curUser)) {
                throw new Exception("Phone Number is already exist");
            }
            //Sđt chưa tồn tại ở user khác thì update lại và save xuống
            curUser.setFullName(newUser.getFullName());
            curUser.setPhoneNumber(newUser.getPhoneNumber());
            curUser.setAddress(newUser.getAddress());
            curUser.setGender(newUser.getGender());
            curUser.setDob(newUser.getDob());
            return userRepository.save(curUser);
        }
        throw new EntityNotFoundException("User not found");
    }

    @Transactional
    @Override
    public User createUserByAdmin(User newUser, List<MultipartFile> certificationImageFiles) throws IOException {
        Date now = new Date();
        User user = new User();

        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new Error("Email is already in use");

        }

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            throw new Error("Email is invalid");

        }
        user.setCreatedAt(now);
        user.setEmail(newUser.getEmail());
        user.setPassword(SystemUtils.passwordHash(newUser.getPassword()));
        user.setFullName(newUser.getFullName());
        user.setPhoneNumber(newUser.getPhoneNumber());
        user.setAddress(newUser.getAddress());
        user.setRoleId(newUser.getRoleId());
        user.setAvatar(AVARTAR_DEFAULT);
        user.setGender(newUser.getGender());
        user.setIsActive(true);
        user.setDob(newUser.getDob());

        user = userRepository.save(user);

        // Upload certification images and set URLs
        if (certificationImageFiles != null && !certificationImageFiles.isEmpty()) {
            for (MultipartFile file : certificationImageFiles) {
                if (!file.isEmpty()) {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String certificationImageUrl = (String) uploadResult.get("url");

                    Certification certification = new Certification();
                    certification.setCertificationImage(certificationImageUrl);
                    certification.setUser(user);

//                    user.getCertifications().add(certification);
                }
            }
        }
        return userRepository.save(user);
    }

    @Override
    public Page<User> getAllUsersByRoleId(int pageNo, int pageSize, int roleId) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return userRepository.findUsersByRoleId(pageable, roleId);
    }

    @Override
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
        Date now = new Date();
        User user = new User();

        if (userRepository.existsByEmail(newUser.getEmail())) {
            return userRepository.findByEmail(newUser.getEmail());
        }

        //Validate email abc@zxc.zxc
        String regexPattern = "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        if (!newUser.getEmail().matches(regexPattern)) {
            throw new Error("Email is invalid");
        }
        user.setCreatedAt(now);
        user.setEmail(newUser.getEmail());
        user.setPassword(SystemUtils.passwordHash(newUser.getPassword()));
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
    public User findUserByEmail(String email) {
        User selectedUser = userRepository.findByEmail(email);
        if (selectedUser != null) {
            return selectedUser;
        }
        return null;
    }
//
//    @Override
//    public User createAnonymousUser(String phoneNumber, String fullName, String gender) {
//        return null;
//    }

    @Override
    public User getUserById(int id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    @Transactional
    @Override
    public User createOrGetAnonymousUser(String phoneNumber, String fullName) {
        Date now = new Date();
        User user = userRepository.findByPhoneNumber(phoneNumber);
        if (user == null) {
            user = new User();
            user.setCreatedAt(now);
            user.setPhoneNumber(phoneNumber);
            user.setFullName(fullName);
            user.setIsActive(true);
            user.setRoleId(1);
            user = userRepository.save(user);
        }
        return user;
    }

    @Override
    public String saveAvatar(MultipartFile file, int userId) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // Check file type
        String contentType = file.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new IOException("Invalid file type. Only image files are allowed.");
        }

        // Upload file to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = uploadResult.get("url").toString();

        // Update user's avatar URL in the database
        User user = getUserById(userId);
        user.setAvatar(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }

    @Override
    public Page<User> getAllUsers(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        return userRepository.findUsersWithSpecificRoles(pageable);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findByRoleId(1);
    }
}
