package com.example.demo.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.FormSubmissionDto;
import com.example.demo.entity.Form;
import com.example.demo.entity.FormSubmission;
import com.example.demo.entity.User;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.FormSubmissionRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/form-submissions")
@CrossOrigin(origins = "https://webproject404-frontend.darkube.app")
public class FormSubmissionController {
    private final FormSubmissionRepository formSubmissionRepository;
    private final FormRepository formRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public FormSubmissionController(FormSubmissionRepository formSubmissionRepository,
                                    FormRepository formRepository,
                                    UserRepository userRepository,
                                    ObjectMapper objectMapper) {
        this.formSubmissionRepository = formSubmissionRepository;
        this.formRepository = formRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<String> submitForm(@RequestBody FormSubmissionDto submissionDto) {
        try {
            Optional<Form> formOpt = formRepository.findById(submissionDto.getFormId());
            if (formOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Form not found");
            }

            FormSubmission submission = new FormSubmission();
            submission.setForm(formOpt.get());

            // Set user if provided
            String username = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName();

            User submitter = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

            submission.setUser(submitter);

            String jsonData = objectMapper.writeValueAsString(submissionDto.getAnswers());
            submission.setData(jsonData);

            formSubmissionRepository.save(submission);
            return ResponseEntity.ok("Form submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting form: " + e.getMessage());
        }
    }

    @GetMapping
    public List<FormSubmission> getSubmissionsByFormId(@RequestParam Long formId) {
        return formSubmissionRepository.findAll()
                .stream()
                .filter(sub -> sub.getForm().getId().equals(formId))
                .collect(Collectors.toList());
    }

    @GetMapping("/user")
    public List<FormSubmission> getSubmissionsByUserId(@RequestParam Long userId) {
        return formSubmissionRepository.findAll()
                .stream()
                .filter(sub -> sub.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubmission(@PathVariable Long id) {
        try {
            formSubmissionRepository.deleteById(id);
            return ResponseEntity.ok("Submission deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting submission: " + e.getMessage());
        }
    }
}
