package com.flamerating.back_flame_rating.service;

import com.flamerating.back_flame_rating.model.User;
import com.flamerating.back_flame_rating.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private IUserRepository userRepository;

    public User registerNewUser(User newUser) throws Exception {

        // A. Validación de unicidad
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new Exception("El nombre de usuario ya está en uso.");
        }
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new Exception("El email ya está registrado.");
        }

        // B. (¡Punto débil! En producción NO se debe hacer)
        // Como no usamos BCrypt, guardamos la contraseña en texto plano.
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

    // --- 3. LÓGICA DE ACTUALIZACIÓN DE PERFIL ---
    public User updateProfile(String currentUsername, User updatedDetails) throws Exception {

        User userToUpdate = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new Exception("Usuario no encontrado."));

        // Se pueden actualizar campos como email o nombre de usuario
        if (updatedDetails.getEmail() != null && !updatedDetails.getEmail().equals(userToUpdate.getEmail())) {
            // Se necesitaría validación extra aquí si el nuevo email ya existe
            userToUpdate.setEmail(updatedDetails.getEmail());
        }

        if (updatedDetails.getUsername() != null
                && !updatedDetails.getUsername().equals(userToUpdate.getUsername())) {
            // Se necesitaría validación extra aquí si el nuevo nombre ya existe
            userToUpdate.setUsername(updatedDetails.getUsername());
        }

        // Lógica para cambio de contraseña (Si el campo no es nulo y no usamos BCrypt)
        if (updatedDetails.getPassword() != null && !updatedDetails.getPassword().isEmpty()) {
            userToUpdate.setPassword(updatedDetails.getPassword());
        }

        return userRepository.save(userToUpdate);
    }

    // --- 4. LÓGICA DE INICIO DE SESIÓN ---
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
}