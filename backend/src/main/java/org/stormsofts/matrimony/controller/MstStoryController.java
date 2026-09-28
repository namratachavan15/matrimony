package org.stormsofts.matrimony.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.stormsofts.matrimony.model.MstStory;
import org.stormsofts.matrimony.service.MstStoryService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/story")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstStoryController {


    @Autowired
    private MstStoryService service;

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public MstStory create(
            @RequestPart("story") String storyJson,
            @RequestPart("photo") MultipartFile photo
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        MstStory story = mapper.readValue(storyJson, MstStory.class);

        String dir = "uploads/stories/";
        String name = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
        Path path = Paths.get(dir + name);
        Files.createDirectories(path.getParent());
        Files.write(path, photo.getBytes());

        story.setSimg(name);
        return service.saveStory(story);
    }

    @GetMapping
    public List<MstStory> getAll() {
        return service.getAllStories();
    }

    @GetMapping("/search")
    public List<MstStory> search(@RequestParam String query) {
        return service.searchStories(query);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.deleteStory(id);
    }

    @PutMapping(value="/{id}", consumes = "multipart/form-data")
    public MstStory update(
            @PathVariable Integer id,
            @RequestPart("story") String oldJson,
            @RequestPart(value="photo", required=false) MultipartFile photo
    ) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        MstStory newStory = mapper.readValue(oldJson, MstStory.class);

        // ✅ Get Existing Story
        MstStory existing = service.getStoryById(id)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        // ✅ IMAGE HANDLING
        if (photo != null && !photo.isEmpty()) {
            String dir = "uploads/stories/";
            String name = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Path path = Paths.get(dir + name);
            Files.createDirectories(path.getParent());
            Files.write(path, photo.getBytes());
            newStory.setSimg(name);   // ✅ new image
        } else {
            newStory.setSimg(existing.getSimg());  // ✅ KEEP OLD IMAGE
        }

        return service.updateStory(id, newStory);
    }

}
