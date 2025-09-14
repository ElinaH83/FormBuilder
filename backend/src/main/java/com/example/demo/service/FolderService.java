package com.example.demo.service;

import com.example.demo.dto.FolderResponseDto;
import com.example.demo.dto.FormResponseDto;
import com.example.demo.entity.Folder;
import com.example.demo.entity.Form;
import com.example.demo.entity.FormField;
import com.example.demo.entity.User;
import com.example.demo.repository.FolderRepository;
import com.example.demo.repository.FormFieldRepository;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    private final FormRepository formRepository;
    private final FormFieldRepository formFieldRepository;
    private final UserRepository userRepository;

    public FolderService(FolderRepository folderRepository, FormRepository formRepository, FormFieldRepository formFieldRepository, UserRepository userRepository) {
        this.folderRepository = folderRepository;
        this.formRepository = formRepository;
        this.formFieldRepository = formFieldRepository;
        this.userRepository = userRepository;
    }

    public List<FolderResponseDto> getAllFolders() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<Folder> folders = folderRepository.findAll();
        List<FolderResponseDto> folderResponseDtos = new ArrayList<>();
        folders.forEach(folder -> {
            List<Form> forms = formRepository.findByFolder(folder);
            List<FormResponseDto> formDtos = new ArrayList<>();
            forms.forEach(form -> {
                if (form.getCreator().equals(creator)) {
                    formDtos.add(form.toResponseDto());
                }
            });
            folderResponseDtos.add(folder.toResponseDto(formDtos));
        });
        return folderResponseDtos;
    }

    public Folder createFolder(String name) {
        Folder folder = new Folder();
        folder.setName(name);
        return folderRepository.save(folder);
    }

    public Form addFormToFolder(Long folderId, Form form) {
        Optional<Folder> folderOpt = folderRepository.findById(folderId);
        if (folderOpt.isEmpty()) return null;
        Folder folder = folderOpt.get();
        form.setFolder(folder);
        form = formRepository.save(form);
        folderRepository.save(folder);
        return form;
    }

    public boolean deleteForm(Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        List<FormField> formFields = formFieldRepository.findByFormId(formId);
        formFields.forEach(formField -> formFieldRepository.deleteById(formField.getId()));
        if (formOpt.isPresent()) {
            formRepository.deleteById(formId);
            return true;
        }
        return false;
    }

    public Form updateFormInFolder(Long folderId, Long formId, Form updatedForm) {
        Optional<Folder> folderOpt = folderRepository.findById(folderId);
        if (folderOpt.isEmpty()) return null;
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) return null;
        Form form = formOpt.get();
        if (form.getFolder() == null || !form.getFolder().getId().equals(folderId)) return null;
        form.setName(updatedForm.getName());
        form.setPublished(updatedForm.isPublished());
        return formRepository.save(form);
    }
}
