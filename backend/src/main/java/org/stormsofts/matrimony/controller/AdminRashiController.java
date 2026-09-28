package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstRashi;
import org.stormsofts.matrimony.service.RashiService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rashi")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminRashiController {

    @Autowired
    private RashiService rashiService;

    @GetMapping
    public List<MstRashi> getAllRashis() {
        return rashiService.getAllRashis();
    }

    @PostMapping
    public MstRashi createRashi(@RequestBody MstRashi rashi) {
        return rashiService.createRashi(rashi);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MstRashi> updateRashi(@PathVariable Integer id, @RequestBody MstRashi rashi) {
        return ResponseEntity.ok(rashiService.updateRashi(id, rashi));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRashi(@PathVariable Integer id) {
        rashiService.deleteRashi(id);
        return ResponseEntity.noContent().build();
    }

}
