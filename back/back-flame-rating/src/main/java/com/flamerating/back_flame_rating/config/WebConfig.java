package com.flamerating.back_flame_rating.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

/**
 * Esta clase configura a Spring para que pueda servir archivos estáticos
 * desde una carpeta externa al proyecto (fuera del classpath).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Lee la ruta desde application.properties (ej:
    // ../front/public/flame-rating-images)
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convertimos la ruta relativa en una ruta absoluta legible por el sistema de
        // archivos
        String absolutePath = Paths.get(uploadDir).toAbsolutePath().toUri().toString();

        // Mapeo: Cuando el navegador pida "/flame-rating-images/**",
        // Spring lo buscará directamente en el disco duro.
        registry.addResourceHandler("/flame-rating-images/**")
                .addResourceLocations(absolutePath);
    }
}