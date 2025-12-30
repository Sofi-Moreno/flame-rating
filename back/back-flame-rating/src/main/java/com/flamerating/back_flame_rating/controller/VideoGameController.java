package com.flamerating.back_flame_rating.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flamerating.back_flame_rating.model.VideoGame;
import com.flamerating.back_flame_rating.service.VideoGameService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.util.StringUtils;
import org.springframework.http.ResponseEntity; // ¡Asegúrate de que todos estos imports estén!
import org.springframework.http.HttpStatus;
import com.flamerating.back_flame_rating.service.ReviewService;

@SuppressWarnings("unused")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class VideoGameController {
    private final VideoGameService videoGameService;
    private ReviewService reviewService;
    @Value("${app.upload.dir}")
    private String uploadDirRelative;

    public VideoGameController(VideoGameService videoGameService) {
        this.videoGameService = videoGameService;
    }

    @PostMapping("/create-videogame")
    public ResponseEntity<?> saveVideoGame(
        @RequestParam("videoGame") String videoGameJson, 
        @RequestParam("mainImage") MultipartFile mainImageFile,
        @RequestParam(value = "images", required = false) MultipartFile[] extraImageFiles
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            VideoGame videoGame = objectMapper.readValue(videoGameJson, VideoGame.class);
            Path uploadDir = Paths.get(uploadDirRelative)
                .toAbsolutePath()
                .normalize();            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            List<String> imagePaths = new ArrayList<>();
            String originalMainFilename = mainImageFile.getOriginalFilename();
            if (originalMainFilename == null || originalMainFilename.trim().isEmpty()) {
                originalMainFilename = "default-main-image.jpg"; // Un nombre de respaldo
            }
            
            String mainImageName = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(originalMainFilename);
            Path mainImagePath = uploadDir.resolve(mainImageName);
            Files.copy(mainImageFile.getInputStream(), mainImagePath, StandardCopyOption.REPLACE_EXISTING);
            imagePaths.add("/flame-rating-images/" + mainImageName);
            if (extraImageFiles != null && extraImageFiles.length > 0) {
                for (MultipartFile file : extraImageFiles) {
                    String originalExtraFilename = file.getOriginalFilename();
                    if (originalExtraFilename == null || originalExtraFilename.trim().isEmpty()) {
                        originalExtraFilename = "default-extra-image.jpg";
                    }
                    
                    String extraImageName = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(originalExtraFilename);
                    Path extraImagePath = uploadDir.resolve(extraImageName);
                    Files.copy(file.getInputStream(), extraImagePath, StandardCopyOption.REPLACE_EXISTING);
                    imagePaths.add("/flame-rating-images/" + extraImageName);
                }
            }

            String allImagesString = String.join(",", imagePaths);
            videoGame.setUrlImages(allImagesString); 

            VideoGame saved = videoGameService.saveVideoGame(videoGame);
            System.out.println(saved);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/listVideogames")
    public List<VideoGame> findAll() {
        return videoGameService.findAll();
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<VideoGame> findByTitle(@PathVariable String title) {
        try {
            VideoGame videoGame = videoGameService.findByTitle(title);
            return ResponseEntity.ok(videoGame);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/videogame-by-id/{id}")
    public ResponseEntity<?> findById(@PathVariable Integer id) {
        try {
            videoGameService.findById(id);
            return ResponseEntity.ok(videoGameService.findById(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video game not found.");
        }
    }

    @DeleteMapping("/delete-videogame/{id}")
    public ResponseEntity<?> deleteVideoGame(@PathVariable Integer id) {
        try {
            videoGameService.deleteVideoGame(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Video game deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update-videogame")
    public ResponseEntity<?> updateVideoGame(
        @RequestParam("videoGame") String videoGameJson,
        @RequestParam(value = "mainImage", required = false) MultipartFile mainImageFile,
        @RequestParam(value = "images", required = false) MultipartFile[] extraImageFiles
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            VideoGame gameData = objectMapper.readValue(videoGameJson, VideoGame.class);
            VideoGame existing = videoGameService.findById(gameData.getId());

            if (existing == null) return ResponseEntity.status(404).body("Juego no encontrado");

            // 1. Recuperar las URLs actuales que envió el Front (las que no se borraron)
            List<String> currentUrls = new ArrayList<>();
            if (gameData.getUrlImages() != null && !gameData.getUrlImages().isBlank()) {
                currentUrls.addAll(Arrays.asList(gameData.getUrlImages().split(",")));
            }

            // 2. Manejar IMAGEN PRINCIPAL NUEVA
            if (mainImageFile != null && !mainImageFile.isEmpty()) {
                String newMainPath = saveFile(mainImageFile);
                if (!currentUrls.isEmpty()) {
                    currentUrls.set(0, newMainPath); // Reemplaza la primera
                } else {
                    currentUrls.add(0, newMainPath); // Si estaba vacío, la agrega
                }
            }

            // 3. Manejar IMÁGENES EXTRA NUEVAS
            if (extraImageFiles != null) {
                for (MultipartFile file : extraImageFiles) {
                    if (!file.isEmpty()) {
                        currentUrls.add(saveFile(file)); // Añade al final
                    }
                }
            }

            // Actualizar campos
            existing.setTitle(gameData.getTitle());
            existing.setSynopsis(gameData.getSynopsis());
            existing.setUrlImages(String.join(",", currentUrls)); // Guardar como string separado por comas

            return ResponseEntity.ok(videoGameService.updateVideoGame(existing));

        } catch (Exception e) {
            e.printStackTrace(); // Revisa la consola de tu IDE, aquí verás el error real
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ARREGLA LA RUTA AQUÍ
    private String saveFile(MultipartFile file) throws IOException {
        String name = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
        // Usa una ruta absoluta real o relativa al proyecto
        Path path = Paths.get(uploadDirRelative).toAbsolutePath().resolve(name);
        
        Files.createDirectories(path.getParent()); // Crea la carpeta si no existe
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        
        return "/flame-rating-images/" + name;
    }

    @PutMapping("/update-average-rating/{id}/{rating}")
    public ResponseEntity<?> updateAverageRating(@PathVariable Integer id, @PathVariable Double rating) {
        try {
            videoGameService.updateAverageRating(id, rating);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    
}

