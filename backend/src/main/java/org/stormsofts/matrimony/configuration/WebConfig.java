package org.stormsofts.matrimony.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve profile images
        registry.addResourceHandler("/uploads/profile/**")
                .addResourceLocations("file:uploads/profile/");

        // Serve Aadhaar front images
        registry.addResourceHandler("/uploads/aadharFront/**")
                .addResourceLocations("file:uploads/aadharFront/");

        // Serve Aadhaar back images if needed
        registry.addResourceHandler("/uploads/aadharBack/**")
                .addResourceLocations("file:uploads/aadharBack/");

        registry.addResourceHandler("/uploads/stories/**")
                .addResourceLocations("file:uploads/stories/");

        registry.addResourceHandler("/uploads/testimonials/**")
                .addResourceLocations("file:uploads/testimonials/");
    }
}
