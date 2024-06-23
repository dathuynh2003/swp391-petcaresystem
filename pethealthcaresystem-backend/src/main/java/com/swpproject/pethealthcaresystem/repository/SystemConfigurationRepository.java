package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, Integer> {
    SystemConfiguration findByConfigKey(String key);
}
