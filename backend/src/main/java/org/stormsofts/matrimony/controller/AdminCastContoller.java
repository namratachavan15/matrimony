package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstCast;
import org.stormsofts.matrimony.service.CastServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cast")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AdminCastContoller {

    @Autowired
    private CastServiceImpl castService;

    // POST: /api/admin/cast
    @PostMapping
    public ResponseEntity<MstCast> saveCast(@RequestBody MstCast mstCast) {

        // ensure default status = 1 if not set
        if (mstCast.getStatus() == null) {
            mstCast.setStatus(1);
        }

        MstCast savedCast = castService.saveCast(mstCast);
        return new ResponseEntity<>(savedCast, HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<MstCast>> getAllCasts() {
        List<MstCast> casts = castService.getAllCasts();
        return new ResponseEntity<>(casts, HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<MstCast>> searchCasts(
            @RequestParam(value = "keyword", required = false) String keyword) {

        List<MstCast> result = castService.searchCasts(keyword);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // ✅ UPDATE – PUT /api/admin/cast/{id}
    @PutMapping("/{id}")
    public ResponseEntity<MstCast> updateCast(
            @PathVariable Integer id,
            @RequestBody MstCast mstCast) {

        MstCast updated = castService.updateCast(id, mstCast);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // ✅ DELETE – DELETE /api/admin/cast/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCast(@PathVariable Integer id) {
        castService.deleteCast(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
