package com.flamerating.back_flame_rating;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BackFlameRatingApplication implements WebMvcConfigurer{
	// ⬇️ 1. INYECTAR LA RUTA CONFIGURADA ⬇️
    @Value("${app.upload.dir}")
    private String uploadDirRelative;

	public static void main(String[] args) {
		SpringApplication.run(BackFlameRatingApplication.class, args);
	}

	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        // 2. CONSTRUIR LA RUTA ABSOLUTA A PARTIR DE LA PROPIEDAD INYECTADA
        String absoluteUploadPath = Paths.get(uploadDirRelative)
            .toAbsolutePath()
            .normalize()
            .toString(); 

        // 3. REGISTRAR LA RUTA EN SPRING
        registry.addResourceHandler("/flame-rating-images/**")
                .addResourceLocations("file:" + absoluteUploadPath + "/");
        
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }
    // ⬆️ FIN DEL MÉTODO DE CONFIGURACIÓN ⬆️

}
