package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstSubcast;
import org.stormsofts.matrimony.service.MstSubcastService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subcast")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminSubCastController {

    @Autowired
    private  MstSubcastService subcastService;

    // INSERT
    @PostMapping
    public ResponseEntity<MstSubcast> createSubcast(@RequestBody MstSubcast subcast) {
        MstSubcast saved = subcastService.addSubcast(subcast);
        return ResponseEntity.ok(saved);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MstSubcast> updateSubcast(
            @PathVariable Integer id,
            @RequestBody MstSubcast subcast
    ) {
        MstSubcast updated = subcastService.updateSubcast(id, subcast);
        return ResponseEntity.ok(updated);
    }

    // DELETE (hard delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcast(@PathVariable Integer id) {
        subcastService.deleteSubcast(id);
        return ResponseEntity.noContent().build();
    }



    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<MstSubcast> getSubcastById(@PathVariable Integer id) {
        return subcastService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // LIST all
    @GetMapping
    public ResponseEntity<List<MstSubcast>> getAllSubcasts() {
        return ResponseEntity.ok(subcastService.getAll());
    }

    // LIST active only
    @GetMapping("/active")
    public ResponseEntity<List<MstSubcast>> getAllActiveSubcasts() {
        return ResponseEntity.ok(subcastService.getAllActive());
    }

    // SEARCH ?q=maratha
    @GetMapping("/search")
    public ResponseEntity<List<MstSubcast>> searchSubcasts(@RequestParam("q") String query) {
        return ResponseEntity.ok(subcastService.searchByName(query));
    }
}
