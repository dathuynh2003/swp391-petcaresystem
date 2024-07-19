package com.swpproject.pethealthcaresystem.service;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import com.swpproject.pethealthcaresystem.repository.SystemConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemConfigService implements ISystemConfigService {
    @Autowired
    private SystemConfigurationRepository systemConfigRepository;

    @Override
    public Page<SystemConfiguration> getSystemConfigurations(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return systemConfigRepository.findAll(pageable);
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

    @Override
    public Page<SystemConfiguration> findAllSConfigurationsByKey(int page, int size, String key) {
        Pageable pageable = PageRequest.of(page, size);
        if (key.equals("All")) {
            return systemConfigRepository.findAll(pageable);
        }
        return systemConfigRepository.findByConfigKeyContainingIgnoreCase(key, pageable);
    }

    @Override
    public List<SystemConfiguration> findAllSConfigByKey(String key) {
        return systemConfigRepository.findAllByConfigKey(key);
    }


}
