package com.swpproject.pethealthcaresystem.repository;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, Integer> {
    SystemConfiguration findByConfigKey(String key);

    Page<SystemConfiguration> findByConfigKeyContainingIgnoreCase(String configKey, Pageable pageable);

    List<SystemConfiguration> findAllByConfigKey(String configKey);
}
