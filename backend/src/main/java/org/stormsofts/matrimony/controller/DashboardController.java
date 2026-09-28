package org.stormsofts.matrimony.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.stormsofts.matrimony.repository.MstStoryRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")

public class DashboardController {

    @Autowired
    private  MstUserRepository userRepo;
    @Autowired
    private  MstStoryRepository storyRepo;

    @GetMapping
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepo.count();
        long totalGirls = userRepo.countByGenderIgnoreCase("female"); // assumes gender="female"
        long totalBoys = userRepo.countByGenderIgnoreCase("male");    // assumes gender="male"
        long totalStories = storyRepo.count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalGirls", totalGirls);
        stats.put("totalBoys", totalBoys);
        stats.put("totalStories", totalStories);

        return stats;
    }
}
