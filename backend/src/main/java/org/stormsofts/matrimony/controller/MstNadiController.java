package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstNadi;
import org.stormsofts.matrimony.service.MstNadiService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/nadi")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstNadiController {

    @Autowired
    private  MstNadiService nadiService;

    @GetMapping
    public ResponseEntity<List<MstNadi>> getAll() {
        return ResponseEntity.ok(nadiService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MstNadi>> search(@RequestParam(required = false, name = "q") String keyword) {
        return ResponseEntity.ok(nadiService.search(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MstNadi> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(nadiService.getById(id));
    }

    @PostMapping
    public ResponseEntity<MstNadi> create(@RequestBody MstNadi nadi) {
        return ResponseEntity.ok(nadiService.create(nadi));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MstNadi> update(@PathVariable Integer id, @RequestBody MstNadi nadi) {
        return ResponseEntity.ok(nadiService.update(id, nadi));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nadiService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

