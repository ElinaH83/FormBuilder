package com.example.demo.dto;

import java.util.List;

public class FormWithFieldsDto {
    private Long id;
    private String name;
    private String title;
    private String description;
    private List<FormFieldDto> fields;

    public FormWithFieldsDto() {}

    public FormWithFieldsDto(Long id, String name, String title, String description, List<FormFieldDto> fields) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.fields = fields;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<FormFieldDto> getFields() { return fields; }
    public void setFields(List<FormFieldDto> fields) { this.fields = fields; }
}
