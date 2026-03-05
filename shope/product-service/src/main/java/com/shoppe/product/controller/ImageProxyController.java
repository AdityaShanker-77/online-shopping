package com.shoppe.product.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@RestController
@RequestMapping("/api/images")
public class ImageProxyController {

    /**
     * Proxies an external image URL through the backend server.
     * This bypasses corporate firewall restrictions and imgur hotlinking blocks.
     * Usage:
     * /api/images/proxy?url=https://images.pexels.com/photos/xyz/pexels-photo-xyz.jpeg
     */
    @GetMapping("/proxy")
    public ResponseEntity<byte[]> proxyImage(@RequestParam("url") String imageUrl) {
        try {
            // Use raw HttpURLConnection instead of RestTemplate for better control
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            connection.setRequestProperty("Accept", "image/*,*/*");
            connection.setRequestProperty("Referer", url.getProtocol() + "://" + url.getHost() + "/");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            connection.setInstanceFollowRedirects(true);

            int responseCode = connection.getResponseCode();
            if (responseCode != 200) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }

            // Read the image bytes
            InputStream inputStream = connection.getInputStream();
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int bytesRead;
            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }
            inputStream.close();
            byte[] imageBytes = buffer.toByteArray();

            if (imageBytes.length < 100) {
                // Tiny response (like imgur's 1x1 GIF block) - return 502
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
            }

            HttpHeaders responseHeaders = new HttpHeaders();
            String contentType = connection.getContentType();
            if (contentType != null && contentType.startsWith("image")) {
                responseHeaders.set("Content-Type", contentType);
            } else if (imageUrl.endsWith(".png")) {
                responseHeaders.setContentType(MediaType.IMAGE_PNG);
            } else {
                responseHeaders.setContentType(MediaType.IMAGE_JPEG);
            }
            // Cache for 7 days to avoid repeated proxy calls
            responseHeaders.setCacheControl(CacheControl.maxAge(java.time.Duration.ofDays(7)));
            responseHeaders.set("Access-Control-Allow-Origin", "*");

            return new ResponseEntity<>(imageBytes, responseHeaders, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Image proxy error for URL: " + imageUrl + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }
}
