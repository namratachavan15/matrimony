package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.MstState;
import org.stormsofts.matrimony.service.MstStateService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/state")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstStateController {

    @Autowired
    private MstStateService stateService;

    public MstStateController(MstStateService stateService) {
        this.stateService = stateService;
    }

    // Get all states
    @GetMapping
    public ResponseEntity<List<MstState>> getAllStates() {
        List<MstState> states = stateService.getAllStates();
        return ResponseEntity.ok(states);
    }

    // Optional: get states by country id
    @GetMapping("/by-country/{cnid}")
    public ResponseEntity<List<MstState>> getStatesByCountry(@PathVariable Integer cnid) {
        List<MstState> states = stateService.getStatesByCountry(cnid);
        return ResponseEntity.ok(states);
    }
}
