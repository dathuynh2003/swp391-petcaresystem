package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;

import java.util.List;

public interface ISystemConfigService {
    List<SystemConfiguration> getSystemConfigurations();

    SystemConfiguration getSystemConfigurationById(int id) throws Exception;

    SystemConfiguration addSystemConfiguration(SystemConfiguration config) throws Exception;

    SystemConfiguration updateSystemConfiguration(int id, SystemConfiguration config) throws Exception;

    void deleteSystemConfiguration(int id);
}
