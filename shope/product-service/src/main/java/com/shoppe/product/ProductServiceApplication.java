package com.shoppe.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableDiscoveryClient
public class ProductServiceApplication {
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @jakarta.annotation.PostConstruct
    public void updateDb() {
        try {
            jdbcTemplate.execute("ALTER TABLE products MODIFY COLUMN image_url MEDIUMTEXT");
            System.out.println("SUCCESS: ALTERED products.image_url TO MEDIUMTEXT");
        } catch (Exception e) {
            System.err.println("DB ALTER FAILED: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
