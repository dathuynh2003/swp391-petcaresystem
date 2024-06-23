package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import com.swpproject.pethealthcaresystem.repository.SystemConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemConfigService implements ISystemConfigService {
    @Autowired
    private SystemConfigurationRepository systemConfigRepository;

    @Override
    public List<SystemConfiguration> getSystemConfigurations() {
        return systemConfigRepository.findAll();
    }

    @Override
    public SystemConfiguration getSystemConfigurationById(int id) throws Exception {
        return systemConfigRepository.findById(id).orElseThrow(() -> new Exception("Could not find a suitable Configuration"));
    }

    @Override
    public SystemConfiguration addSystemConfiguration(SystemConfiguration config) throws Exception {
        if (config == null) {
            throw new Exception("System configuration cannot be null");
        }
        return systemConfigRepository.save(config);
    }

    @Override
    public SystemConfiguration updateSystemConfiguration(int id, SystemConfiguration config) throws Exception {
        if (config == null) {
            throw new Exception("New system configuration info cannot be null");
        }
        SystemConfiguration existedConfig = systemConfigRepository.findById(id)
                .orElseThrow(() -> new Exception("Could not find a suitable Configuration"));
        existedConfig.setConfigKey(config.getConfigKey());
        existedConfig.setConfigValue(config.getConfigValue());
        return systemConfigRepository.save(existedConfig);
    }

    @Override
    public void deleteSystemConfiguration(int id) {
        systemConfigRepository.deleteById(id);
    }


}
