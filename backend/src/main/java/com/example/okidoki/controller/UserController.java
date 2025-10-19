package com.example.okidoki.controller;

import com.example.okidoki.dto.LoginDto;
import com.example.okidoki.dto.ResponseDTO;
import com.example.okidoki.dto.UserDto;
import com.example.okidoki.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequestMapping("api")
@AllArgsConstructor
@RestController
public class UserController {

    public final UserService userService;

    @GetMapping("/user")
    public List<UserDto> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/public/user")
    public ResponseDTO addUser(@RequestBody UserDto userDto) {
        return userService.addUser(userDto);
    }

    @GetMapping("/public/user/{id}")
    public UserDto getUserById(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PutMapping("/user/{id}")
    public void overwriteUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        userService.updateUser(id, userDto);
    }
    @PostMapping("/public/login")
    public ResponseDTO login(@RequestBody LoginDto loginDto) {
        return userService.login(loginDto);
    }

    @GetMapping("/public/email/{email}")
    public boolean emailCheck(@PathVariable String email) {
        return userService.checkEmail(email);
    }

}
