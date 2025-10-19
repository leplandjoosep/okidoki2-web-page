package com.example.okidoki.repository;

import com.example.okidoki.entity.Picture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PictureRepo extends JpaRepository<Picture, Long> {
}
