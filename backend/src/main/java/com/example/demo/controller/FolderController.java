package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.FolderResponseDto;
import com.example.demo.entity.Folder;
import com.example.demo.entity.Form;
import com.example.demo.service.FolderService;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "https://webproject404-frontend.darkube.app")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<FolderResponseDto> getAllFolders() {
        return folderService.getAllFolders();
    }

    @PostMapping
    public Folder createFolder(@RequestBody Map<String, String> body) {
        return folderService.createFolder(body.get("name"));
    }

    @PostMapping("/form")
    public Form addForm(@RequestBody Map<String, Object> payload) {
        Long folderId = Long.valueOf(payload.get("folderId").toString());
        Form form = new com.fasterxml.jackson.databind.ObjectMapper().convertValue(payload.get("form"), Form.class);
        return folderService.addFormToFolder(folderId, form);
    }

    @DeleteMapping("/form/{formId}")
    public boolean deleteForm(@PathVariable Long formId) {
        return folderService.deleteForm(formId);
    }

    @PutMapping("/{folderId}/form/{formId}")
    public Form updateFormInFolder(@PathVariable Long folderId, @PathVariable Long formId, @RequestBody Form updatedForm) {
        return folderService.updateFormInFolder(folderId, formId, updatedForm);
    }
}