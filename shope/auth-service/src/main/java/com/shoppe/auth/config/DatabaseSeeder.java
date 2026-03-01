package com.shoppe.auth.config;

import com.shoppe.auth.model.Role;
import com.shoppe.auth.model.RoleName;
import com.shoppe.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.shoppe.auth.model.User;
import com.shoppe.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRole(RoleName.ROLE_USER);
        seedRole(RoleName.ROLE_RETAILER);
        seedRole(RoleName.ROLE_ADMIN);
        
        seedAdminUser();
    }

    private void seedRole(RoleName roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }

    private void seedAdminUser() {
        User admin = userRepository.findByEmail("admin@shoppe.com").orElse(new User());
        admin.setName("Super Admin");
        admin.setEmail("admin@shoppe.com");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        
        Set<Role> roles = new HashSet<>();
        roleRepository.findByName(RoleName.ROLE_ADMIN).ifPresent(roles::add);
        admin.setRoles(roles);
        
        userRepository.save(admin);
        System.out.println("MASTER ADMIN ACCOUNT CREATED/UPDATED: admin@shoppe.com / Admin123!");
    }
}
