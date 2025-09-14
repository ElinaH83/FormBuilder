package com.example.demo.dto;

import com.example.demo.entity.Form;

import java.util.List;

public class FolderResponseDto {
    private Long id;
    private String name;
    private List<FormResponseDto> forms;
    public FolderResponseDto(Long id, String name, List<FormResponseDto> forms) {
        this.id = id;
        this.name = name;
        this.forms = forms;
    }
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public List<FormResponseDto> getForms() {
        return forms;
    }
    public void setForms(List<FormResponseDto> forms) {
        this.forms = forms;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }

}
