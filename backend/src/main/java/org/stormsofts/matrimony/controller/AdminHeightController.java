package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstHeight;
import org.stormsofts.matrimony.service.HeightService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/height")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminHeightController {


    @Autowired
    private HeightService heightService;

    @GetMapping
    public List<MstHeight> getAll() {
        return heightService.getAllHeights();
    }

    @PostMapping
    public MstHeight create(@RequestBody MstHeight height) {
        return heightService.createHeight(height);
    }

    @PutMapping("/{id}")
    public MstHeight update(@PathVariable Integer id, @RequestBody MstHeight height) {
        return heightService.updateHeight(id, height);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        heightService.deleteHeight(id);
    }


}
