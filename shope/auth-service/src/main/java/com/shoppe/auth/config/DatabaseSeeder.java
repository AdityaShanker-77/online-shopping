package com.shoppe.auth.config;

import com.shoppe.auth.model.Role;
import com.shoppe.auth.model.RoleName;
import com.shoppe.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        seedRole(RoleName.ROLE_USER);
        seedRole(RoleName.ROLE_RETAILER);
        seedRole(RoleName.ROLE_ADMIN);
    }

    private void seedRole(RoleName roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }
}
