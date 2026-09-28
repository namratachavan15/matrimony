package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstColor;
import org.stormsofts.matrimony.service.MstColorService;

import java.util.List;

@RestController
@RequestMapping("/api/colors")

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstColorController {

    @Autowired
    MstColorService mstColorService;

    @GetMapping
    public ResponseEntity<List<MstColor>> getAllColors() {
        return ResponseEntity.ok(mstColorService.getAllColors());
    }

    @PostMapping
    public ResponseEntity<MstColor> addColor(@RequestBody MstColor color) {
        if (color.getColor() == null || color.getColor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        MstColor saved = mstColorService.addColor(color);
        return ResponseEntity.ok(saved);
    }
}
