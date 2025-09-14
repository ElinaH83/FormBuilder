package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Form;
import com.example.demo.entity.FormField;
import com.example.demo.entity.FormSubmission;
import com.example.demo.repository.FormFieldRepository;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.FormSubmissionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "https://webproject404-frontend.darkube.app")
public class ReportController {

    private final FormRepository formRepository;
    private final FormSubmissionRepository formSubmissionRepository;
    private final FormFieldRepository formFieldRepository;

    public ReportController(FormRepository formRepository, FormSubmissionRepository formSubmissionRepository, FormFieldRepository formFieldRepository) {
        this.formRepository = formRepository;
        this.formFieldRepository = formFieldRepository;
        this.formSubmissionRepository = formSubmissionRepository;
    }

    @GetMapping("/{formId}/report")
    public ResponseEntity<?> getFormReport(@PathVariable Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Form form = formOpt.get();

        List<FormField> fields = formFieldRepository.findAll()
                .stream()
                .filter(sub -> sub.getForm().getId().equals(formId))
                .collect(Collectors.toList());

        List<FormSubmission> submissions = formSubmissionRepository.findAll()
                .stream()
                .filter(sub -> sub.getForm().getId().equals(formId))
                .collect(Collectors.toList());

        Map<Long, Map<String, Integer>> fieldStats = new HashMap<>(); // questionId -> {answer: count}
        ObjectMapper mapper = new ObjectMapper();

        for (FormField field : fields) {
            fieldStats.put(field.getId(), new HashMap<>());
        }

        for (FormSubmission submission : submissions) {
            try {
                JsonNode data = mapper.readTree(submission.getData());
                for (FormField field : fields) {
                    JsonNode answer = data.get(field.getId().toString());
                    if (answer != null) {
                        String ans = answer.asText();
                        Map<String, Integer> stats = fieldStats.get(field.getId());
                        stats.put(ans, stats.getOrDefault(ans, 0) + 1);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Map<String, Object> report = new HashMap<>();
        report.put("formId", form.getId());
        report.put("formTitle", form.getName());

        List<Map<String, Object>> fieldReports = fields.stream().map(field -> {
            Map<String, Object> f = new HashMap<>();
            f.put("id", field.getId());
            f.put("label", field.getLabel());
            f.put("type", field.getType());
            f.put("stats", fieldStats.get(field.getId()));
            return f;
        }).collect(Collectors.toList());

        report.put("fields", fieldReports);
        report.put("submissionCount", submissions.size());

        return ResponseEntity.ok(report);
    }
}
