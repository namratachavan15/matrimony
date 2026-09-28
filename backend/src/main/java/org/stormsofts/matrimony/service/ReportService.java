package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.ReportReason;
import org.stormsofts.matrimony.model.ReportResponseDTO;
import org.stormsofts.matrimony.model.ReportStatus;

public interface ReportService {

    ReportResponseDTO submitReport(Integer reporterId, Integer reportedUserId, ReportReason reason, String description);

    /** Admin: list reports, optionally filtered by status. */
    Page<ReportResponseDTO> getReports(ReportStatus status, Pageable pageable);

    ReportResponseDTO updateStatus(Integer reportId, ReportStatus newStatus, String adminNote);

    long countByStatus(ReportStatus status);
}
