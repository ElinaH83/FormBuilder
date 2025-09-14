package com.example.demo.repository;

import com.example.demo.entity.Folder;
import com.example.demo.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormRepository extends JpaRepository<Form, Long> {
    Optional<Form> findById(long id);
    List<Form> findByFolder(Folder folder);
}
