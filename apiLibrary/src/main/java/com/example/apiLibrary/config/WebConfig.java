package com.example.apiLibrary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply to all paths under /api
                .allowedOrigins("*")   // TODO: Restrict allowed origins in a production environment for security.
                                       // e.g., .allowedOrigins("http://localhost:4200", "https://yourfrontenddomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Common HTTP methods
                .allowedHeaders("*")   // Allow all headers
                .allowCredentials(true) // Allow credentials (e.g., cookies, authorization headers)
                                        // Useful if frontend sends credentials, common for session-based auth or some OAuth flows.
                                        // For JWT in Authorization header, this might not be strictly needed by all browsers
                                        // but is good practice to include if any credential passing might occur.
                .maxAge(3600);         // Cache pre-flight OPTIONS request for 1 hour
    }
}
