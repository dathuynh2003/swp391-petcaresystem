package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ISystemConfigService {

    Page<SystemConfiguration> getSystemConfigurations(int page, int size);

    SystemConfiguration getSystemConfigurationById(int id) throws Exception;

    SystemConfiguration addSystemConfiguration(SystemConfiguration config) throws Exception;

    SystemConfiguration updateSystemConfiguration(int id, SystemConfiguration config) throws Exception;

    void deleteSystemConfiguration(int id);

    Page<SystemConfiguration> findAllSConfigurationsByKey(int page, int size, String key);

    List<SystemConfiguration> findAllSConfigByKey(String key);
}
