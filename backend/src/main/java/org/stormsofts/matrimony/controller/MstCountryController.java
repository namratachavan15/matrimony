package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.matrimony.model.MstCountry;
import org.stormsofts.matrimony.service.MstCountryService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/country")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstCountryController {

    @Autowired
    private MstCountryService countryService;


    // Get all countries
    @GetMapping
    public ResponseEntity<List<MstCountry>> getAllCountries() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }

    // Optional: Get only active countries (status = 1)
    @GetMapping("/active")
    public ResponseEntity<List<MstCountry>> getActiveCountries() {
        return ResponseEntity.ok(countryService.getActiveCountries());
    }
}

