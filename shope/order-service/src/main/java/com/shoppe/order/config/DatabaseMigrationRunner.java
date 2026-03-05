package com.shoppe.order.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Running one-time schema migrations...");
            jdbcTemplate.execute("ALTER TABLE cart_items MODIFY COLUMN image_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE compare_items MODIFY COLUMN image_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE wishlists MODIFY COLUMN image_url LONGTEXT");
            jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN shipping_address LONGTEXT"); // just in case
            System.out.println("Migrations completed successfully.");
        } catch (Exception e) {
            System.err.println("Migration warning (table might not exist yet): " + e.getMessage());
        }
    }
}
