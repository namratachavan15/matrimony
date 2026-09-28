package org.stormsofts.matrimony.controller;




import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.stormsofts.matrimony.model.MstTestimonial;
import org.stormsofts.matrimony.service.MstTestimonialService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonial")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstTestimonialController {

    private final MstTestimonialService service;

    public MstTestimonialController(MstTestimonialService service) {
        this.service = service;
    }

    // ✅ GET ALL
    @GetMapping
    public List<MstTestimonial> getAll() {
        return service.getAllTestimonials();
    }

    // ✅ CREATE
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public MstTestimonial create(
            @RequestPart("testimonial") String json,
            @RequestPart("photo") MultipartFile photo
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        MstTestimonial t = mapper.readValue(json, MstTestimonial.class);

        String dir = "uploads/testimonials/";
        String name = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
        Path path = Paths.get(dir + name);
        Files.createDirectories(path.getParent());
        Files.write(path, photo.getBytes());

        t.setSimg(name);

        return service.saveTestimonial(t);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.deleteTestimonial(id);
    }

    // ✅ UPDATE
    @PutMapping(value="/{id}", consumes = "multipart/form-data")
    public MstTestimonial update(
            @PathVariable Integer id,
            @RequestPart("testimonial") String json,
            @RequestPart(value="photo", required=false) MultipartFile photo
    ) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        MstTestimonial t = mapper.readValue(json, MstTestimonial.class);

        // Fetch existing
        MstTestimonial existing = service.getTestimonialById(id)
                .orElseThrow(() -> new RuntimeException("Testimonial not found"));

        // Handle photo
        if(photo != null && !photo.isEmpty()){
            String dir = "uploads/testimonials/";
            String name = System.currentTimeMillis()+"_"+photo.getOriginalFilename();
            Path path = Paths.get(dir + name);
            Files.createDirectories(path.getParent());
            Files.write(path, photo.getBytes());
            t.setSimg(name);
        } else {
            t.setSimg(existing.getSimg()); // keep old
        }

        return service.updateTestimonial(id, t);
    }
}
