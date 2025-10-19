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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @Test
    void add_user_success() {
        UserDto userDto = UserDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password")
                .id(1)
                .build();

        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepo.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser savedUser = invocation.getArgument(0);
            savedUser.setId(1L);
            return savedUser;
        });
        when(jwtUtil.generateToken(1)).thenReturn("jwtToken");

        ResponseDTO responseDTO = userService.addUser(userDto);

        assertEquals("jwtToken", responseDTO.token()); // Adjust here
        verify(userRepo).save(any(AppUser.class));
    }

    @Test
    void get_user_success() {
        when(userRepo.getReferenceById(1L)).thenReturn(mock(AppUser.class));
        when(userMapper.toDto(any(AppUser.class))).thenReturn(mock(UserDto.class));

        UserDto result = userService.getUser(1L);

        assertNotNull(result);
        verify(userRepo).getReferenceById(1L);
        verify(userMapper).toDto(any(AppUser.class));
    }

    @Test
    void get_all_users_success() {
        when(userRepo.findAll()).thenReturn(Arrays.asList(mock(AppUser.class)));
        when(userMapper.toDtoList(anyList())).thenReturn(Arrays.asList(mock(UserDto.class)));

        List<UserDto> result = userService.getAllUsers();

        assertEquals(1, result.size());
        verify(userRepo).findAll();
        verify(userMapper).toDtoList(anyList());
    }

    @Test
    void delete_user_success() {
        userService.deleteUser(1L);
        verify(userRepo).deleteById(1L);
    }

    @Test
    void update_user_success() {
        UserDto userDto = UserDto.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password")
                .build();

        AppUser existingUser = new AppUser();
        existingUser.setId(1L);

        when(userRepo.getReferenceById(1L)).thenReturn(existingUser);
        when(userRepo.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.updateUser(1L, userDto);

        verify(userRepo).getReferenceById(1L);
        verify(userRepo).save(any(AppUser.class));
    }

    @Test
    void login_success() {
        LoginDto loginDto = new LoginDto("john.doe@example.com", "password");

        AppUser existingUser = new AppUser();
        existingUser.setEmail("john.doe@example.com");
        existingUser.setPassword("encodedPassword");
        existingUser.setId(1L);

        when(userRepo.getReferenceByEmail("john.doe@example.com")).thenReturn(existingUser);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(1)).thenReturn("jwtToken");

        ResponseDTO responseDTO = userService.login(loginDto);

        assertEquals("jwtToken", responseDTO.token());
        verify(userRepo).getReferenceByEmail("john.doe@example.com");
        verify(passwordEncoder).matches("password", "encodedPassword");
        verify(jwtUtil).generateToken(1);
    }

    @Test
    void login_failure_wrong_password() {
        LoginDto loginDto = new LoginDto("john.doe@example.com", "wrongPassword");

        AppUser existingUser = new AppUser();
        existingUser.setEmail("john.doe@example.com");
        existingUser.setPassword("encodedPassword");

        when(userRepo.getReferenceByEmail("john.doe@example.com")).thenReturn(existingUser);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(ApplicationException.class, () -> userService.login(loginDto));
    }

    @Test
    void login_failure_user_not_found() {
        LoginDto loginDto = new LoginDto("nonexistent@example.com", "password");

        when(userRepo.getReferenceByEmail("nonexistent@example.com")).thenReturn(null);

        assertThrows(ApplicationException.class, () -> userService.login(loginDto));
    }
}
