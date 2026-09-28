package org.stormsofts.matrimony.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.matrimony.model.MstBlood;
import org.stormsofts.matrimony.service.MstBloodService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/blood")

@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstBloodController {

    @Autowired
    private  MstBloodService bloodService;

    @GetMapping
    public List<MstBlood> getAllBloodGroups() {
        return bloodService.getAllBloodGroups();
    }
}
