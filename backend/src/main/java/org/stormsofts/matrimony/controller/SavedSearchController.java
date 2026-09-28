package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.RenameSavedSearchDTO;
import org.stormsofts.matrimony.model.SavedSearchDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.SavedSearchService;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/saved-searches")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*"
)
public class SavedSearchController {

    @Autowired
    private SavedSearchService savedSearchService;

    // GET /api/saved-searches/my
    @GetMapping("/my")
    public ResponseEntity<?> mySavedSearches() {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        return ResponseEntity.ok(savedSearchService.getMySavedSearches(userId));
    }

    // POST /api/saved-searches  body: { name, filters: {...} }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody SavedSearchDTO body) {

        System.out.println("========== SAVE SEARCH REQUEST ==========");
        System.out.println("Name: " + body.getName());
        System.out.println("Filters: " + body.getFilters());

        Integer userId = AuthUtil.currentUserId();

        System.out.println("Current User ID: " + userId);

        if (userId == null) {
            System.out.println("USER ID IS NULL");
            return ResponseEntity
                    .status(401)
                    .body("Not authenticated.");
        }

        try {

            SavedSearchDTO dto = savedSearchService.save(
                    userId,
                    body.getName(),
                    body.getFilters()
            );

            System.out.println("SAVE SUCCESS. ID: " + dto.getId());

            return ResponseEntity
                    .status(201)
                    .body(dto);

        } catch (IllegalArgumentException e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(409)
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Could not save saved search: " + e.getMessage());
        }
    }

    // PUT /api/saved-searches/{id}  body: { name }  (Rename)
    @PutMapping("/{id}")
    public ResponseEntity<?> rename(@PathVariable Integer id, @RequestBody RenameSavedSearchDTO body) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            return ResponseEntity.ok(savedSearchService.rename(userId, id, body.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // DELETE /api/saved-searches/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            savedSearchService.delete(userId, id);
            return ResponseEntity.ok(Map.of("deleted", true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}