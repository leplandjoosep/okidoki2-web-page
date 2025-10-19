package com.example.okidoki.dto;

public record ProductDTO (Long id, String name, Integer ownerId, String description, Integer pictureId, Float price) {
}
