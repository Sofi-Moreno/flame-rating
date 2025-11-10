package com.flamerating.back_flame_rating.controller;

import com.flamerating.back_flame_rating.service.UserService;
import com.flamerating.back_flame_rating.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
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
        try {
            // A. Llama al servicio para validar y guardar el usuario
            User registeredUser = userService.registerNewUser(user);

            // B. Devuelve el objeto creado con el código de estado 201 Created
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);

        } catch (Exception e) {
            // C. Maneja errores de validación (ej. usuario/email ya existen)
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 2. ENDPOINT PARA OBTENER DATOS DEL PERFIL
    // RUTA: GET /api/users/{username}
    // Requiere autenticación (JWT) para asegurar que el usuario esté logueado.
    @GetMapping("/{username}")
    // En una implementación real, se debería usar @AuthenticationPrincipal
    // para obtener el usuario logueado, en lugar de pasar el {username}
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        // La lógica de búsqueda se hace en el UserService.

        return userService.findByUsername(username)
                .map(user -> ResponseEntity.ok(user)) // Si encuentra, devuelve 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si no encuentra, devuelve 404 Not Found
    }

    // 3. ENDPOINT PARA INICIO DE SESIÓN (LOGIN)
    // RUTA: POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        // Nota: En un proyecto real, usarías un DTO, no la entidad User.

        try {
            User authenticatedUser = userService.authenticate(
                    // OJO: Asegúrate de que estos getters coincidan con tu clase User
                    loginRequest.getUsername(),
                    loginRequest.getPassword());

            // Si las credenciales son correctas, devuelve el objeto User
            return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);

        } catch (Exception e) {
            // El servicio lanza la excepción si las credenciales son inválidas
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); // Código 401 Unauthorized
        }
    }
}