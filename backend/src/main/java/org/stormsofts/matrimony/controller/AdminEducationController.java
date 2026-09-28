package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstEducation;
import org.stormsofts.matrimony.service.EducationService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/education")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminEducationController {

    @Autowired
    private EducationService educationService;

    @GetMapping
    public List<MstEducation> getAll() {
        return educationService.getAll();
    }

    @PostMapping
    public MstEducation create(@RequestBody MstEducation education) {
        return educationService.create(education);
    }

    @PutMapping("/{id}")
    public MstEducation update(@PathVariable Integer id, @RequestBody MstEducation education) {
        return educationService.update(id, education);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        educationService.delete(id);
    }

}
