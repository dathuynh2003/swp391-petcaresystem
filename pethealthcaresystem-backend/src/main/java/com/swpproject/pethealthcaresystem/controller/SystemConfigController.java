package com.swpproject.pethealthcaresystem.controller;

import com.swpproject.pethealthcaresystem.model.SystemConfiguration;
import com.swpproject.pethealthcaresystem.model.User;
import com.swpproject.pethealthcaresystem.service.SystemConfigService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pethealthcare.vercel.app"}, allowCredentials = "true")

public class SystemConfigController {
    @Autowired
    private SystemConfigService systemConfigService;

    @GetMapping("/configurations")
    public Map<String, Object> getAllConfigurations(HttpSession session,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            Page<SystemConfiguration> configurations = systemConfigService.getSystemConfigurations(page, size);
            response.put("message", "Successfully");
            response.put("configurations", configurations);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/configuration/{id}")
    public Map<String, Object> getConfigurationById(@PathVariable int id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            SystemConfiguration configuration = systemConfigService.getSystemConfigurationById(id);
            response.put("message", "Successfully");
            response.put("configurations", configuration);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/configuration/add")
    public Map<String, Object> addConfiguration(@RequestBody SystemConfiguration config, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            SystemConfiguration newConfig = systemConfigService.addSystemConfiguration(config);
            response.put("message", "Successfully");
            response.put("configurations", newConfig);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PutMapping("/configuration/update/{id}")
    public Map<String, Object> updateConfiguration(@PathVariable int id, @RequestBody SystemConfiguration config, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            SystemConfiguration updateConfig = systemConfigService.updateSystemConfiguration(id, config);
            response.put("message", "Successfully");
            response.put("configurations", updateConfig);
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/configuration/{id}")
    public Map<String, Object> deleteConfiguration(@PathVariable int id, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            systemConfigService.deleteSystemConfiguration(id);
            response.put("message", "Deleted");
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }
    
    @GetMapping("/configuration/search/{key}")
    public Map<String, Object> getConfigByKey(@PathVariable String key,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            if (curUser.getRoleId() != 4) {
                throw new Exception("Can not get configurations");
            }
            response.put("message", "Successfully");
            response.put("configurations", systemConfigService.findAllSConfigurationsByKey(page, size, key));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/configurations/{configKey}")
    public Map<String, Object> getAllSConfigByKey(@PathVariable String configKey, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        try {
            User curUser = (User) session.getAttribute("user");
            if (curUser == null) {
                throw new Exception("You need login first");
            }
            response.put("message", "Successfully");
            response.put("configurations", systemConfigService.findAllSConfigByKey(configKey));
        } catch (Exception e) {
            response.put("message", e.getMessage());
        }
        return response;
    }
}
