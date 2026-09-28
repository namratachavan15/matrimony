package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ProfileViewDTO;
import org.stormsofts.matrimony.model.ProfileViewerDTO;
import org.stormsofts.matrimony.service.ProfileView;

import java.util.List;

@RestController
@RequestMapping("/api/admin/profile-views")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ProfileController {

    @Autowired
    private ProfileView service;

    @GetMapping
    public List<ProfileViewDTO> getProfileViews(@RequestParam(value = "search", required = false) String search) {
        return service.getViewedProfiles(search);
    }

    // New endpoint
    @GetMapping("/{profileId}/viewers")
    public List<ProfileViewerDTO> getProfileViewers(@PathVariable Integer profileId) {
        return service.getProfileViewers(profileId);
    }

}
