package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstNakshtra;
import org.stormsofts.matrimony.service.MstNakshtraService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/nakshtra")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstNakshtraController {

    @Autowired
    private MstNakshtraService nakshtraService;

    @GetMapping
    public ResponseEntity<List<MstNakshtra>> getAll() {
        return ResponseEntity.ok(nakshtraService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MstNakshtra>> search(@RequestParam(required = false, name = "q") String keyword) {
        return ResponseEntity.ok(nakshtraService.search(keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MstNakshtra> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(nakshtraService.getById(id));
    }

    @PostMapping
    public ResponseEntity<MstNakshtra> create(@RequestBody MstNakshtra nakshtra) {
        return ResponseEntity.ok(nakshtraService.create(nakshtra));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MstNakshtra> update(@PathVariable Integer id, @RequestBody MstNakshtra nakshtra) {
        return ResponseEntity.ok(nakshtraService.update(id, nakshtra));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nakshtraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

