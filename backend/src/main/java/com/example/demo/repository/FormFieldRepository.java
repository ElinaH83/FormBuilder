package com.example.demo.repository;

import com.example.demo.entity.FormField;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormFieldRepository extends JpaRepository<FormField, Long> {
    Optional<FormField> findById(long id);
    List<FormField> findByFormId(Long formId);
}


