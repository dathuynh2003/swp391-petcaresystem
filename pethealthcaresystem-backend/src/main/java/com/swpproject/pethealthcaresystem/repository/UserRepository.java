package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRoleId(int roleId);
}
