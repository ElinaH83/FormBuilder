package com.example.demo.controller;

import com.example.demo.dto.UpdateEmailRequestDto;
import com.example.demo.dto.UpdatePasswordRequestDto;
import com.example.demo.dto.UpdateUsernameRequestDto;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService s) { this.userService = s; }

    @GetMapping
    public ResponseEntity<UserDto> findLoggedInUser() {
        User user = userService.getLoggedInUser();
        return ResponseEntity.ok(userService.toDto(user));
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(userService::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        System.out.println("Fetching user with id: " + id);
        return userService.findById(id)
                .map(userService::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/username")
    public ResponseEntity<UserDto> updateUsername(
            @PathVariable Long id,
            @RequestBody UpdateUsernameRequestDto req) {
        User updated = userService.updateUsername(id, req.getNewUsername());
        return ResponseEntity.ok(userService.toDto(updated));
    }

    @PutMapping("/{id}/email")
    public ResponseEntity<UserDto> updateEmail(
            @PathVariable Long id,
            @RequestBody UpdateEmailRequestDto req) {
        User updated = userService.updateEmail(id, req.getNewEmail());
        return ResponseEntity.ok(userService.toDto(updated));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<UserDto> updatePassword(
            @PathVariable Long id,
            @RequestBody UpdatePasswordRequestDto req) {
        User updated = userService.updatePassword(id, req.getOldPassword(), req.getNewPassword());
        return ResponseEntity.ok(userService.toDto(updated));
    }


}
