package com.shoppe.order.dto;

import lombok.Data;

@Data
public class PaymentIntentResponse {
    private String clientSecret;

    public PaymentIntentResponse(String clientSecret) {
        this.clientSecret = clientSecret;
    }
}
