package com.swpproject.pethealthcaresystem.Repository;

import com.swpproject.pethealthcaresystem.Model.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<user, Long> {
    user findByEmail(String email);
    Boolean existsByEmail(String email);
}
