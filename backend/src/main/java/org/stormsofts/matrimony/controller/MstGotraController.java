package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstGotra;
import org.stormsofts.matrimony.service.MstGotraService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gotra")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstGotraController {


    @Autowired
    private  MstGotraService gotraService;

    // GET all
    @GetMapping
    public ResponseEntity<List<MstGotra>> getAll() {
        return ResponseEntity.ok(gotraService.getAll());
    }

    // Optional search ?q=xyz
    @GetMapping("/search")
    public ResponseEntity<List<MstGotra>> search(@RequestParam(required = false, name = "q") String keyword) {
        return ResponseEntity.ok(gotraService.search(keyword));
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<MstGotra> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(gotraService.getById(id));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<MstGotra> create(@RequestBody MstGotra gotra) {
        MstGotra created = gotraService.create(gotra);
        return ResponseEntity.ok(created);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<MstGotra> update(@PathVariable Integer id, @RequestBody MstGotra gotra) {
        MstGotra updated = gotraService.update(id, gotra);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        gotraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


