package com.flamerating.back_flame_rating;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackFlameRatingApplication implements WebMvcConfigurer{
    @Value("${app.upload.dir}")
    private String uploadDirRelative;

	public static void main(String[] args) {
		SpringApplication.run(BackFlameRatingApplication.class, args);
	}

	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        String absoluteUploadPath = Paths.get(uploadDirRelative)
            .toAbsolutePath()
            .normalize()
            .toString(); 

        registry.addResourceHandler("/flame-rating-images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
        
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }

}
