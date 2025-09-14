package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.FieldDto;
import com.example.demo.dto.FormDto;
import com.example.demo.dto.FormFieldDto;
import com.example.demo.dto.FormWithFieldsDto;
import com.example.demo.entity.Folder;
import com.example.demo.entity.Form;
import com.example.demo.entity.FormField;
import com.example.demo.entity.User;
import com.example.demo.repository.FolderRepository;
import com.example.demo.repository.FormFieldRepository;
import com.example.demo.repository.FormRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "https://webproject404-frontend.darkube.app")
public class FormController {

    private final FormRepository formRepository;
    private final FormFieldRepository formFieldRepository;
    private final UserRepository userRepository;
    private final FolderRepository folderRepository;

    public FormController(FormRepository formRepository, UserRepository userRepository, FormFieldRepository formFieldRepository, FolderRepository folderRepository) {
        this.formRepository = formRepository;
        this.userRepository = userRepository;
        this.formFieldRepository = formFieldRepository;
        this.folderRepository = folderRepository;
    }

    @PostMapping
    public String saveForm(@RequestBody FormDto formDto) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));


        Folder folder = folderRepository.findById(1L).orElseGet(() -> {
            Folder newFolder = new Folder();
            newFolder.setName("Created forms");
            return folderRepository.save(newFolder);
        });

        Form form = new Form();
        form.setName(formDto.getTitle());
        form.setPublished(formDto.isPublished());
        form.setDescription(formDto.getDescription());
        form.setFolder(folder);
        form.setCreator(creator);
        formRepository.save(form);

        for (FieldDto fieldDto : formDto.getFields()) {
            FormField field = new FormField();
            field.setLabel(fieldDto.getLabel());
            field.setType(fieldDto.getType());
            field.setRequiredField(fieldDto.isRequired());
            field.setOptions(String.join(";", fieldDto.getOptions()));
            field.setForm(form);
            formFieldRepository.save(field);
        }

        return "Form saved successfully!";
    }

    @GetMapping
    public List<Map<String, Object>> getAllForms() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        return formRepository.findAll().stream()
                .filter( form -> !form.getCreator().equals(creator))
                .map(form -> {
                    Map<String, Object> f = new HashMap<>();
                    f.put("id", form.getId());
                    f.put("title", form.getName());
                    f.put("creator", form.getCreator());
                    f.put("description", form.getDescription());
                    return f;
                }).collect(Collectors.toList());
    }

    @GetMapping("/report")
    public List<Map<String, Object>> getAllFormsForReport() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        return formRepository.findAll().stream()
                .filter(form -> form.getCreator().equals(creator))
                .map(form -> {
                    Map<String, Object> f = new HashMap<>();
                    f.put("id", form.getId());
                    f.put("title", form.getName());
                    f.put("creator", form.getCreator());
                    f.put("description", form.getDescription());
                    return f;
                })
                .collect(Collectors.toList());

    }

    @GetMapping("/{formId}")
    public ResponseEntity<?> getFormById(@PathVariable Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form form = formOpt.get();
        List<FormField> fields = formFieldRepository.findAll().stream()
                .filter(f -> f.getForm().getId().equals(formId))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("id", form.getId());
        result.put("title", form.getName());
        result.put("description", form.getDescription());
        result.put("published", form.isPublished());
        result.put("headerImage", null);
        result.put("fields", fields.stream().map(field -> {
            Map<String, Object> f = new HashMap<>();
            f.put("id", field.getId());
            f.put("label", field.getLabel());
            f.put("type", field.getType());
            f.put("required", field.isRequiredField());
            f.put("options", field.getOptions() != null ? List.of(field.getOptions().split(";")) : List.of());
            return f;
        }).collect(Collectors.toList()));

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{formId}")
    public ResponseEntity<?> deleteForm(@PathVariable Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form form = formOpt.get();

        List<FormField> formFields = formFieldRepository.findByFormId(formId);
        formFieldRepository.deleteAll(formFields);

        formRepository.delete(form);

        return ResponseEntity.ok().body("Form deleted successfully.");
    }

    @GetMapping("/{formId}/questions")
    public ResponseEntity<?> getQuestionsForForm(@PathVariable Long formId) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<FormField> fields = formFieldRepository.findAll().stream()
                .filter(sub -> sub.getForm().getId().equals(formId))
                .collect(Collectors.toList());

        List<Map<String, Object>> questions = fields.stream().map(field -> {
            Map<String, Object> q = new HashMap<>();
            q.put("id", field.getId());
            q.put("title", field.getLabel());
            return q;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{id}/fields")
    public ResponseEntity<FormWithFieldsDto> getFormWithFields(@PathVariable Long id) {
        Optional<Form> formOpt = formRepository.findById(id);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form form = formOpt.get();
        List<FormField> fields = formFieldRepository.findByFormId(id);

        FormWithFieldsDto dto = new FormWithFieldsDto(
                form.getId(),
                form.getName(),
                form.getName(),
                form.getDescription(),
                fields.stream().map(field -> new FormFieldDto(
                        field.getId(),
                        field.getType(),
                        field.getLabel(),
                        field.getOptions(),
                        field.isRequiredField()
                )).collect(Collectors.toList())
        );

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{formId}")
    public ResponseEntity<?> updateForm(@PathVariable Long formId, @RequestBody FormDto formDto) {
        Optional<Form> formOpt = formRepository.findById(formId);
        if (formOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form form = formOpt.get();
        form.setName(formDto.getTitle());
        form.setPublished(formDto.isPublished());
        form.setDescription(formDto.getDescription());
        formRepository.save(form);

        List<FormField> oldFields = formFieldRepository.findAll().stream()
                .filter(f -> f.getForm().getId().equals(formId))
                .collect(Collectors.toList());
        formFieldRepository.deleteAll(oldFields);

        for (FieldDto fieldDto : formDto.getFields()) {
            FormField field = new FormField();
            field.setLabel(fieldDto.getLabel());
            field.setType(fieldDto.getType());
            field.setRequiredField(fieldDto.isRequired());
            field.setOptions(String.join(";", fieldDto.getOptions()));
            field.setForm(form);
            formFieldRepository.save(field);
        }

        return ResponseEntity.ok("Form updated successfully!");
    }
}
