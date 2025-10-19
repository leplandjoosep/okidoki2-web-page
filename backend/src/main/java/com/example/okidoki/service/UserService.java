package com.example.okidoki.service;

import com.example.okidoki.dto.LoginDto;
import com.example.okidoki.dto.ResponseDTO;
import com.example.okidoki.dto.UserDto;
import com.example.okidoki.entity.AppUser;
import com.example.okidoki.exception.ApplicationException;
import com.example.okidoki.mapper.UserMapper;
import com.example.okidoki.repository.UserRepo;
import com.example.okidoki.security.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

    private UserRepo userRepo;
    @Autowired
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;


    public ResponseDTO addUser(UserDto userDto) {
        AppUser existingUser = userRepo.getReferenceByEmail(userDto.email().toLowerCase());
        if (existingUser != null) {
            throw new ApplicationException("Email already in use");
        }
        AppUser user = new AppUser();
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());
        user.setEmail(userDto.email());
        user.setPassword(passwordEncoder.encode(userDto.password()));
        userRepo.save(user);
        log.debug("New user registered.");
        return new ResponseDTO(jwtUtil.generateToken(user.getId().intValue()));
    }

    public UserDto getUser(Long id) {
        return userMapper.toDto(userRepo.getReferenceById(id));
    }

    public List<UserDto> getAllUsers() {
        return userMapper.toDtoList(userRepo.findAll());
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
        log.debug("User deleted by the id: {}", id);
    }

    public void updateUser(Long id, UserDto userDto) {
        AppUser user = userRepo.getReferenceById(id);
        user.setFirstName(userDto.firstName());
        user.setLastName(userDto.lastName());

        AppUser existingUser = userRepo.getReferenceByEmail(userDto.email().toLowerCase());
        if (existingUser == null) {
            user.setEmail(userDto.email());
        }
        if (userDto.password() != null && !userDto.password().equals("")) {
            user.setPassword(passwordEncoder.encode(userDto.password()));
        }
        log.debug("User information updated for the user: {}", userDto);
        userRepo.save(user);
    }


    public ResponseDTO login(LoginDto dto) {
        log.debug("Login attempt for email: {}", dto.email());

        AppUser user = userRepo.getReferenceByEmail(dto.email().toLowerCase());
        if (user == null || !passwordEncoder.matches(dto.password(), user.getPassword())) {
            log.warn("Login attempt failed for email: {}", dto.email());
            throw new ApplicationException("Wrong username or password.");
        }

        log.debug("User logged in successfully: {}", dto.email());
        // Generate token
        return new ResponseDTO(jwtUtil.generateToken(user.getId().intValue()));
    }

    public boolean checkEmail(String email) {
        AppUser user = userRepo.getReferenceByEmail(email.toLowerCase());
        return user == null;
    }
}

