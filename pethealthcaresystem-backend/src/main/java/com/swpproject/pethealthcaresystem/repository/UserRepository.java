package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRoleId(int roleId);
//    List<User> findByIsActiveTrue();
//    List<User> findByRoleIdAndIsActiveTrue(int roleId);
    Page<User> findUsersByRoleId(Pageable pageable, int roleId);
    Boolean existsByPhoneNumber(String phoneNumber);
    User findByPhoneNumber(String phoneNumber);
    User findUserByPhoneNumber(String phoneNumber);
    long countByRoleId(int roleId);
}
