package com.shoppe.retailer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RetailerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RetailerServiceApplication.class, args);
    }
}
