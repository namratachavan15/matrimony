package org.stormsofts.matrimony.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstDistrict;
import org.stormsofts.matrimony.service.MstDistrictService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/district")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstDistrictController {

    private final MstDistrictService districtService;

    public MstDistrictController(MstDistrictService districtService) {
        this.districtService = districtService;
    }

    // GET /api/admin/district/all   -> all active districts
    @GetMapping("/all")
    public ResponseEntity<List<MstDistrict>> getAllActiveDistricts() {
        return ResponseEntity.ok(districtService.getAllActiveDistricts());
    }

    // GET /api/admin/district/by-state/{stid}
    // Example: /api/admin/district/by-state/1
    @GetMapping("/by-state/{stid}")
    public ResponseEntity<List<MstDistrict>> getDistrictsByState(@PathVariable String stid) {
        return ResponseEntity.ok(districtService.getDistrictsByState(stid));
    }
}