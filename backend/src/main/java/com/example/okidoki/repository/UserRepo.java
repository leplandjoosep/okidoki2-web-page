package com.example.okidoki.repository;

import com.example.okidoki.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<AppUser, Long> {
    AppUser getReferenceByEmail(String email);

}
