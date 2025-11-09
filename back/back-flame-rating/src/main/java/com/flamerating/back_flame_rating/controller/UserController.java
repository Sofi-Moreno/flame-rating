package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.service.UserService;
import com.flamerating.back_flame_rating.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Inyección de dependencia del servicio que contendrá la lógica de negocio
    @Autowired
    private UserService userService;

    // 1. ENDPOINT PARA REGISTRO (CREAR USUARIO)
    // RUTA: POST /api/users/register
    // No requiere autenticación.
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // La lógica de verificación de unicidad, hashing de contraseña y guardado
        // se hará dentro del UserService.

        // return userService.register(user);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    // 2. ENDPOINT PARA OBTENER DATOS DEL PERFIL
    // RUTA: GET /api/users/{username}
    // Requiere autenticación (JWT) para asegurar que el usuario esté logueado.
    @GetMapping("/{username}")
    // En una implementación real, se debería usar @AuthenticationPrincipal
    // para obtener el usuario logueado, en lugar de pasar el {username}
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        // La lógica de búsqueda se hace en el UserService.

        // Optional<User> user = userService.findByUsername(username);
        // if (user.isPresent()) {
        // return ResponseEntity.ok(user.get());
        // }
        return ResponseEntity.notFound().build();
    }

    // 3. ENDPOINT PARA ACTUALIZAR PERFIL
    // RUTA: PUT /api/users/{username}
    // Requiere autenticación y autorización (solo el usuario puede modificar su
    // propio perfil).
    @PutMapping("/{username}")
    public ResponseEntity<User> updateUserProfile(@PathVariable String username, @RequestBody User updatedUser) {
        // La lógica de actualización y verificación de permisos va aquí.

        // return userService.updateProfile(username, updatedUser);
        return ResponseEntity.ok(updatedUser);
    }

    /* 4. ENDPOINT PARA INICIO DE SESIÓN (LOGIN) */

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        // En una implementación real, se usaría un DTO, no la entidad User
        // directamente.

        try {
            User authenticatedUser = userService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword());

            // Devuelve la información del usuario autenticado (se puede simplificar en el
            // futuro)
            return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);

        } catch (Exception e) {
            // El servicio lanza la excepción si las credenciales son inválidas
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // Código 401 Unauthorized
        }
    }
}