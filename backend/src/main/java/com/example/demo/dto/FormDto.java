package com.example.demo.dto;
import java.util.List;


public class FormDto {
    private String title;
    private String description;
    private String headerImage; // base64 string
    private List<FieldDto> fields;
    private boolean published;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHeaderImage() { return headerImage; }
    public void setHeaderImage(String headerImage) { this.headerImage = headerImage; }

    public List<FieldDto> getFields() { return fields; }
    public void setFields(List<FieldDto> fields) { this.fields = fields; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}
