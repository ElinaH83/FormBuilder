package com.example.demo.repository;

import com.example.demo.entity.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
    Optional<FormSubmission> findById(long id);
}
