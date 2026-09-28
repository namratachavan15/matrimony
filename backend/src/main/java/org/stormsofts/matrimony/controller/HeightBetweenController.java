package org.stormsofts.matrimony.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.matrimony.model.MstHeightBetween;
import org.stormsofts.matrimony.repository.HeightBetweenRepository;
import org.stormsofts.matrimony.service.HeightBetweenService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/heightbetween")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class HeightBetweenController {

    @Autowired
    private HeightBetweenService heightBetweenService;

    @GetMapping
    public List<MstHeightBetween> getAllHeights() {
        return heightBetweenService.getAllHeights();
    }
}
