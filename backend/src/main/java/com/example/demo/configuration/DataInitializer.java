package com.example.demo.configuration;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadData(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // userRepository.save(new User("alice", "alice@example.com", passwordEncoder.encode("password1")));
            // userRepository.save(new User("bob", "bob@example.com", passwordEncoder.encode("password2")));
            // userRepository.save(new User("charlie", "charlie@example.com", passwordEncoder.encode("password3")));
            // userRepository.save(new User("dave", "dave@example.com", passwordEncoder.encode("password4")));
            // userRepository.save(new User("eve", "eve@example.com", passwordEncoder.encode("password5")));
        };
    }
}
