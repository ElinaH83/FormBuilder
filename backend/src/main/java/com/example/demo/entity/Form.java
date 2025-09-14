package com.example.demo.entity;

import com.example.demo.dto.FormDto;
import com.example.demo.dto.FormResponseDto;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "forms")
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private boolean published;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public boolean isPublished() { return published; }

    public void setPublished(boolean published) { this.published = published; }

    public User getCreator() { return creator; }

    public void setCreator(User creator) { this.creator = creator; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Folder getFolder() { return folder; }
    public void setFolder(Folder folder) { this.folder = folder; }

    public FormResponseDto toResponseDto() {
        return new FormResponseDto(this.id, this.name, "", this.description);
    }
}
