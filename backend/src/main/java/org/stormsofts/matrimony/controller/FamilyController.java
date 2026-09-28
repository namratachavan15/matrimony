package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstFamily;
import org.stormsofts.matrimony.service.FamilyService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/family")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class FamilyController {

    @Autowired
    private FamilyService familyService;

    @GetMapping
    public List<MstFamily> getAllFamilies() {
        return familyService.getAllFamilies();
    }

    @GetMapping("/{id}")
    public MstFamily getFamily(@PathVariable Integer id) {
        return familyService.getFamilyById(id);
    }
    @PostMapping
    public MstFamily createFamily(@RequestBody MstFamily family) {
        return familyService.createFamily(family);
    }

    @PutMapping("/{id}")
    public MstFamily updateFamily(@PathVariable Integer id, @RequestBody MstFamily family) {
        return familyService.updateFamily(id, family);
    }

    @DeleteMapping("/{id}")
    public void deleteFamily(@PathVariable Integer id) {
        familyService.deleteFamily(id);
    }
    @GetMapping("/search")
    public List<MstFamily> searchFamilies(@RequestParam String keyword) {
        return familyService.searchFamilies(keyword);
    }

    @GetMapping("/by-user/{uid}")
    public ResponseEntity<MstFamily> getFamilyByUserId(@PathVariable Integer uid) {
        System.out.println("user id"+uid);
        return familyService.getFamilyByUserId(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
