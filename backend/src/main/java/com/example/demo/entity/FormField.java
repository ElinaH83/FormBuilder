package com.example.demo.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "form_fields")
public class FormField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String label;

    @Column(length = 2000)
    private String options; 

    @Column(name = "is_required")
    private boolean requiredField;

    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

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

    public Form getForm() { return form; }

    public void setForm(Form form) { this.form = form; }
}
