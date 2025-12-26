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
}