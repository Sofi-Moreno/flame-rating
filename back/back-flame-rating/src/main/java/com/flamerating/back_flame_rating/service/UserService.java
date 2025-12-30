package com.flamerating.back_flame_rating.service;

import com.flamerating.back_flame_rating.model.User;
import com.flamerating.back_flame_rating.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private IUserRepository userRepository;

    // Esta variable leerá la ruta hacia la carpeta public del front desde
    // application.properties
    @Value("${app.upload.dir}")
    private String uploadDirRelative;

    public User registerNewUser(User newUser) throws Exception {

        // A. Validación de unicidad
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new Exception("El nombre de usuario ya está en uso.");
        }
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new Exception("El email ya está registrado.");
        }

        // B. (¡Punto débil! En producción NO se debe hacer)
        // newUser.setPassword(newUser.getPassword()); // No hace falta, pero ilustra el
        // punto

        // C. El nuevo usuario es por defecto "Común"
        newUser.setIsAdmin(false);

        // D. Guardar en la Base de Datos
        return userRepository.save(newUser);
    }

    // --- 2. LÓGICA DE BÚSQUEDA / PERFIL ---
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // --- 3. LÓGICA DE INICIO DE SESIÓN ---
    // Este método es crucial para el login, sin usar Spring Security.
    public User authenticate(String username, String rawPassword) throws Exception {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new Exception("Credenciales inválidas."));

        // COMPARACIÓN EN TEXTO PLANO (SIN HASHING)
        if (user.getPassword().equals(rawPassword)) {
            // Contraseña correcta. En un sistema real, aquí se generaría el JWT.
            return user;
        } else {
            throw new Exception("Credenciales inválidas.");
        }
    }

    // --- 4. NUEVO: LÓGICA DE ACTUALIZACIÓN ---
    public User updateUser(Integer idUser, User userDetails, MultipartFile image) throws Exception {
        // A. Buscar el usuario existente por ID
        User existingUser = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new Exception("Usuario no encontrado con ID: " + idUser));

        // B. Validar unicidad si el username está cambiando
        if (!existingUser.getUsername().equals(userDetails.getUsername()) &&
                userRepository.existsByUsername(userDetails.getUsername())) {
            throw new Exception("El nuevo nombre de usuario ya está en uso.");
        }

        // C. Validar unicidad si el email está cambiando
        if (!existingUser.getEmail().equals(userDetails.getEmail()) &&
                userRepository.existsByEmail(userDetails.getEmail())) {
            throw new Exception("El nuevo email ya está registrado.");
        }

        // 4. Procesar la imagen si se ha enviado una nueva
        if (image != null && !image.isEmpty()) {
            try {
                // 1. Obtener la ruta absoluta desde la propiedad definida en
                // application.properties
                Path uploadPath = Paths.get(uploadDirRelative).toAbsolutePath().normalize();

                // 2. Crear directorios si no existen
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // 3. Generar un nombre único para evitar duplicados
                String originalFilename = image.getOriginalFilename();
                String fileExtension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                String fileName = UUID.randomUUID().toString() + fileExtension;

                // 4. Guardar el archivo físicamente en la carpeta del frontend
                Path targetLocation = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // 5. Guardar la URL relativa en la base de datos (Prefijo que Angular entiende)
                // Se guarda como /flame-rating-images/nombre-archivo.jpg
                existingUser.setProfileImage("/flame-rating-images/" + fileName);

            } catch (IOException e) {
                throw new Exception("Error al guardar la imagen de perfil: " + e.getMessage());
            }
        }

        // D. Actualizar los campos permitidos
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setEmail(userDetails.getEmail());

        // Solo actualizamos la contraseña si el objeto recibido trae una
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            existingUser.setPassword(userDetails.getPassword());
        }

        // Nota: Por seguridad, no permitimos cambiar isAdmin desde aquí
        // a menos que implementes una lógica de roles específica.
        // existingUser.setIsAdmin(userDetails.getIsAdmin());

        // E. Guardar los cambios
        return userRepository.save(existingUser);
    }

    public void deleteUser(Integer idUser) throws Exception {
        // Usamos existsByIdUser para evitar errores del IDE con JpaRepository
        if (!userRepository.existsByIdUser(idUser)) {
            throw new Exception("No se puede eliminar: El usuario con ID " + idUser + " no existe.");
        }

        // Buscamos el objeto primero para asegurar la eliminación a través de la
        // entidad
        User userToDelete = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new Exception("Error al recuperar el usuario para eliminar."));

        userRepository.delete(userToDelete);
    }
}