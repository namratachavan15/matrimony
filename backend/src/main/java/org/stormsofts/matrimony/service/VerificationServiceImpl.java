package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.time.Instant;
import java.util.NoSuchElementException;

@Service
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private MstUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public MyVerificationStatusDTO getMyStatus(Integer userId) {
        MstUser u = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found."));
        Integer vs = u.getVstatus() == null ? STATUS_PENDING : u.getVstatus();
        return new MyVerificationStatusDTO(vs, label(vs), u.getVerificationRejectionReason(), u.getVerifiedAt());
    }

    @Override
    public Page<AdminVerificationCardDTO> getForReview(Integer status, Pageable pageable) {
        int effective = status == null ? STATUS_PENDING : status;
        return userRepository.findByVstatusOrderByJdateAsc(effective, pageable)
                .map(AdminVerificationCardDTO::new);
    }

    @Override
    @Transactional
    public AdminVerificationCardDTO approve(Integer userId) {
        MstUser u = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found."));
        u.setVstatus(STATUS_VERIFIED);
        u.setVerificationRejectionReason(null);
        u.setVerifiedAt(Instant.now());
        u = userRepository.save(u);

        notificationService.notify(
                u.getId(),
                NotificationType.PROFILE_VERIFIED,
                "Profile Verified",
                "Your profile has been verified. You now have a Verified badge.",
                null,
                null
        );
        return new AdminVerificationCardDTO(u);
    }

    @Override
    @Transactional
    public AdminVerificationCardDTO reject(Integer userId, String reason) {
        MstUser u = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found."));
        u.setVstatus(STATUS_REJECTED);
        u.setVerificationRejectionReason(reason == null || reason.isBlank() ? "Not specified." : reason);
        u.setVerifiedAt(null);
        u = userRepository.save(u);

        notificationService.notify(
                u.getId(),
                NotificationType.PROFILE_REJECTED,
                "Verification Rejected",
                "Your profile verification was rejected: " + u.getVerificationRejectionReason(),
                null,
                null
        );
        return new AdminVerificationCardDTO(u);
    }

    @Override
    public long countByStatus(int status) {
        return userRepository.countByVstatus(status);
    }

    private String label(int vstatus) {
        return switch (vstatus) {
            case STATUS_VERIFIED -> "VERIFIED";
            case STATUS_REJECTED -> "REJECTED";
            default -> "PENDING";
        };
    }
}