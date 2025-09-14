package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FormField;
import com.example.demo.entity.FormSubmission;
import com.example.demo.repository.FormFieldRepository;
import com.example.demo.repository.FormSubmissionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "https://webproject404-frontend.darkube.app")
public class QuestionStatsController {

    @Autowired
    private FormFieldRepository formFieldRepository;

    @Autowired
    private FormSubmissionRepository formSubmissionRepository;

    @GetMapping("/{questionId}/stats")
    public ResponseEntity<?> getQuestionStats(@PathVariable Long questionId) {
        Optional<FormField> fieldOpt = formFieldRepository.findById(questionId);
        if (fieldOpt.isEmpty()) return ResponseEntity.notFound().build();

        List<FormSubmission> submissions = formSubmissionRepository.findAll();
        Map<String, Integer> stats = new HashMap<>();

        for (FormSubmission submission : submissions) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode data = mapper.readTree(submission.getData());
                JsonNode answer = data.get(questionId.toString());
                if (answer != null) {
                    String ans = answer.asText();
                    stats.put(ans, stats.getOrDefault(ans, 0) + 1);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return ResponseEntity.ok(stats);
    }
}
