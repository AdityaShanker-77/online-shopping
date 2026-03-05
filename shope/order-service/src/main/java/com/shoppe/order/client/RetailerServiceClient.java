package com.shoppe.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;

@FeignClient(name = "retailer-service", path = "/api/retailers")
public interface RetailerServiceClient {
    @PutMapping("/{id}/revenue")
    void addRevenue(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount);
}
