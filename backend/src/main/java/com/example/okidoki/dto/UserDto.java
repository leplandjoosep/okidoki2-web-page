package com.example.okidoki.dto;

import lombok.Builder;

@Builder
public record UserDto (Integer id, String firstName, String lastName, String email, String password) {
}
