package com.example.demo.dto;

import java.util.Map;

public class FormSubmissionDto {
    private Long formId;
    private Long userId; // Optional, can be null for anonymous submissions
    private Map<String, Object> answers;

    public FormSubmissionDto() {}

    public FormSubmissionDto(Long formId, Long userId, Map<String, Object> answers) {
        this.formId = formId;
        this.userId = userId;
        this.answers = answers;
    }

    // Getters and Setters
    public Long getFormId() { return formId; }
    public void setFormId(Long formId) { this.formId = formId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Map<String, Object> getAnswers() { return answers; }
    public void setAnswers(Map<String, Object> answers) { this.answers = answers; }
}
