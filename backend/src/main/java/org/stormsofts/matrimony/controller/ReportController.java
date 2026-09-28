package org.stormsofts.matrimony.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.matrimony.model.ReportRequestDTO;
import org.stormsofts.matrimony.model.ReportResponseDTO;
import org.stormsofts.matrimony.model.ReportStatus;
import org.stormsofts.matrimony.model.ReportStatusUpdateDTO;
import org.stormsofts.matrimony.security.AuthUtil;
import org.stormsofts.matrimony.service.ReportService;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // ---- User-facing ----

    // POST /api/reports  body: { reportedUserId, reason, description }
    @PostMapping("/api/reports")
    public ResponseEntity<?> submit(@RequestBody ReportRequestDTO body) {
        Integer userId = AuthUtil.currentUserId();
        if (userId == null) return ResponseEntity.status(401).body("Not authenticated.");
        try {
            ReportResponseDTO dto = reportService.submitReport(
                    userId, body.getReportedUserId(), body.getReason(), body.getDescription());
            return ResponseEntity.status(201).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // ---- Admin-facing ----
    // Note: SecurityConfig currently allows any authenticated user through to
    // these paths (see its Part 6 comment on admin/user route separation), so
    // enforce ADMIN explicitly here as defense in depth.

    // GET /api/admin/reports?status=PENDING&page=0&size=20
    @GetMapping("/api/admin/reports")
    public ResponseEntity<?> list(
            @RequestParam(value = "status", required = false) ReportStatus status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<ReportResponseDTO> result = reportService.getReports(status, pageable);
        return ResponseEntity.ok(result);
    }

    // PATCH /api/admin/reports/{id}/status  body: { status, adminNote }
    @PatchMapping("/api/admin/reports/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody ReportStatusUpdateDTO body) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        if (body.getStatus() == null) return ResponseEntity.badRequest().body("status is required.");
        try {
            return ResponseEntity.ok(reportService.updateStatus(id, body.getStatus(), body.getAdminNote()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // GET /api/admin/reports/count?status=PENDING
    @GetMapping("/api/admin/reports/count")
    public ResponseEntity<?> count(@RequestParam(value = "status", defaultValue = "PENDING") ReportStatus status) {
        if (!AuthUtil.isAdmin()) return ResponseEntity.status(403).body("Admin access required.");
        return ResponseEntity.ok(Map.of("count", reportService.countByStatus(status)));
    }
}
