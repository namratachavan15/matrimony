package org.stormsofts.matrimony.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstOtherinfo;
import org.stormsofts.matrimony.service.OtherinfoService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/otherinfo")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class OtherinfoController {

    private final OtherinfoService service;

    public OtherinfoController(OtherinfoService service) {
        this.service = service;
    }

    @GetMapping
    public List<MstOtherinfo> getAll() {
        return service.getAll();
    }

    @GetMapping("/search")
    public List<MstOtherinfo> search(@RequestParam(required = false) String keyword) {
        return service.search(keyword);
    }



    @PostMapping
    public MstOtherinfo create(@RequestBody MstOtherinfo otherinfo) {
        return service.save(otherinfo);
    }

    @PutMapping("/{id}")
    public MstOtherinfo update(@PathVariable Integer id, @RequestBody MstOtherinfo otherinfo) {
        return service.update(id, otherinfo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-user/{uid}")
    public ResponseEntity<MstOtherinfo> getOtherInfoByUserId(@PathVariable Integer uid) {
        return service.getOtherInfoByUserId(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}

