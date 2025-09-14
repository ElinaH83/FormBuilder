package com.example.demo.dto;

public class FormFieldDto {
    private Long id;
    private String type;
    private String label;
    private String options;
    private boolean requiredField;

    public FormFieldDto() {}

    public FormFieldDto(Long id, String type, String label, String options, boolean requiredField) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.options = options;
        this.requiredField = requiredField;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }

    public boolean isRequiredField() { return requiredField; }
    public void setRequiredField(boolean requiredField) { this.requiredField = requiredField; }
}
