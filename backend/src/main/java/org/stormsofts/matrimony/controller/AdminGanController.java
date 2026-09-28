package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstGan;
import org.stormsofts.matrimony.service.GanService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gan")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminGanController {

    @Autowired
    private GanService ganService;

    @PostMapping
    public MstGan createGan(@RequestBody MstGan gan) {
        return ganService.createGan(gan);
    }

    @GetMapping
    public List<MstGan> getAllGans() {
        return ganService.getAllGans();
    }

    @PutMapping("/{id}")
    public MstGan updateGan(@PathVariable Integer id, @RequestBody MstGan gan) {
        return ganService.updateGan(id, gan);
    }

    @DeleteMapping("/{id}")
    public void deleteGan(@PathVariable Integer id) {
        ganService.deleteGan(id);
    }


}
