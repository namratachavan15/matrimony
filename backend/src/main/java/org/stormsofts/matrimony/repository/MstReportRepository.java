package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstReport;
import org.stormsofts.matrimony.model.ReportStatus;

public interface MstReportRepository extends JpaRepository<MstReport, Integer> {

    boolean existsByReporterIdAndReportedUserIdAndStatus(Integer reporterId, Integer reportedUserId, ReportStatus status);

    Page<MstReport> findByReporterIdOrderByCreatedAtDesc(Integer reporterId, Pageable pageable);

    Page<MstReport> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<MstReport> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);

    long countByStatus(ReportStatus status);
}
