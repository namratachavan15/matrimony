package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstMarriage;
import org.stormsofts.matrimony.service.MarriageService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/marriage")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminMarriageController {

    @Autowired
    private MarriageService marriageService;

    @GetMapping
    public List<MstMarriage> getAll() {
        return marriageService.getAllMarriages();
    }

    @PostMapping
    public MstMarriage create(@RequestBody MstMarriage marriage) {
        return marriageService.createMarriage(marriage);
    }

    @PutMapping("/{id}")
    public MstMarriage update(@PathVariable Integer id, @RequestBody MstMarriage marriage) {
        return marriageService.updateMarriage(id, marriage);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        marriageService.deleteMarriage(id);
    }

}
