package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstAbout;
import org.stormsofts.matrimony.service.MstAboutService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/about")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstAboutController {

    @Autowired
    private MstAboutService aboutService;


    @GetMapping
    public List<MstAbout> getAll() {
        return aboutService.getAllAbouts();
    }



    @PostMapping
    public MstAbout create(@RequestBody MstAbout about) {
        return aboutService.saveAbout(about);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        aboutService.deleteAbout(id);
    }
}
