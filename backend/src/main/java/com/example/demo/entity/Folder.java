package com.example.demo.entity;

import com.example.demo.dto.FolderResponseDto;
import com.example.demo.dto.FormResponseDto;

import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "folders")
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Constructor
    public Folder(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Folder() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public FolderResponseDto toResponseDto(List<FormResponseDto> formDtos) {
        return new FolderResponseDto(this.id, this.name, formDtos);
    }
}
