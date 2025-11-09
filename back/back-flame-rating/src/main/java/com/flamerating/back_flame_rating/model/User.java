package com.flamerating.back_flame_rating.model;

import jakarta.persistence.*;

@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(nullable = false, unique = true, length = 50)
    private String nombreDeUsuario;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private boolean esAdmin = false;

    public User() {
    }

    public User(String nombreDeUsuario, String email, String password, boolean esAdmin) {
        this.nombreDeUsuario = nombreDeUsuario;
        this.email = email;
        this.password = password;
        this.esAdmin = esAdmin;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public String getNombreDeUsuario() {
        return nombreDeUsuario;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isEsAdmin() {
        return esAdmin;
    }

    public void setNombreDeUsuario(String nombreDeUsuario) {
        this.nombreDeUsuario = nombreDeUsuario;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEsAdmin(boolean esAdmin) {
        this.esAdmin = esAdmin;
    }

}
