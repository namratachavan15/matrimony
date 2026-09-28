package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstReportRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.time.Instant;
import java.util.NoSuchElementException;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private MstReportRepository reportRepository;

    @Autowired
    private MstUserRepository userRepository;

    @Override
    @Transactional
    public ReportResponseDTO submitReport(Integer reporterId, Integer reportedUserId, ReportReason reason, String description) {
        if (reporterId == null || reportedUserId == null || reason == null) {
            throw new IllegalArgumentException("reportedUserId and reason are required.");
        }
        if (reporterId.equals(reportedUserId)) {
            throw new IllegalArgumentException("You cannot report your own profile.");
        }
        if (!userRepository.existsById(reportedUserId)) {
            throw new NoSuchElementException("Reported user not found.");
        }
        if (reportRepository.existsByReporterIdAndReportedUserIdAndStatus(reporterId, reportedUserId, ReportStatus.PENDING)) {
            throw new IllegalStateException("You already have a pending report against this profile.");
        }

        MstReport report = new MstReport();
        report.setReporterId(reporterId);
        report.setReportedUserId(reportedUserId);
        report.setReason(reason);
        report.setDescription(description);
        report.setStatus(ReportStatus.PENDING);
        report = reportRepository.save(report);
        return toDTO(report);
    }

    @Override
    public Page<ReportResponseDTO> getReports(ReportStatus status, Pageable pageable) {
        Page<MstReport> page = (status == null)
                ? reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                : reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return page.map(this::toDTO);
    }

    @Override
    @Transactional
    public ReportResponseDTO updateStatus(Integer reportId, ReportStatus newStatus, String adminNote) {
        MstReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NoSuchElementException("Report not found."));
        report.setStatus(newStatus);
        if (adminNote != null) {
            report.setAdminNote(adminNote);
        }
        report.setUpdatedAt(Instant.now());
        report = reportRepository.save(report);
        return toDTO(report);
    }

    @Override
    public long countByStatus(ReportStatus status) {
        return reportRepository.countByStatus(status);
    }

    private ReportResponseDTO toDTO(MstReport r) {
        String reporterName = userRepository.findById(r.getReporterId()).map(MstUser::getUname).orElse("Unknown");
        String reportedName = userRepository.findById(r.getReportedUserId()).map(MstUser::getUname).orElse("Unknown");
        return new ReportResponseDTO(
                r.getId(), r.getReporterId(), reporterName,
                r.getReportedUserId(), reportedName,
                r.getReason(), r.getDescription(), r.getStatus(),
                r.getAdminNote(), r.getCreatedAt()
        );
    }
}
