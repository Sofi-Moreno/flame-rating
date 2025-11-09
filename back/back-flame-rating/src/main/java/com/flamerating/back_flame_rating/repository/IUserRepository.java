package com.flamerating.back_flame_rating.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.flamerating.back_flame_rating.model.User;

@Repository
public interface IUserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByNombreDeUsuario(String nombreDeUsuario);

    boolean existsByNombreDeUsuario(String nombreDeUsuario);

    boolean existsByEmail(String email);
}