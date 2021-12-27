package de.wps.sign2MintServer.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:4200",
                        "http://localhost",
                        "http://localhost:81",
                        "https://sign2mint.de",
                        "https://sign2mint.com",
                        "https://sign2mint.org",
                        "https://test.sign2mint.de",
                        "https://test.sign2mint.com",
                        "https://test.sign2mint.org");

        WebMvcConfigurer.super.addCorsMappings(registry);
    }
}
