package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.AdminVerificationCardDTO;
import org.stormsofts.matrimony.model.MyVerificationStatusDTO;

public interface VerificationService {

    int STATUS_PENDING = 0;
    int STATUS_VERIFIED = 1;
    int STATUS_REJECTED = 2;

    MyVerificationStatusDTO getMyStatus(Integer userId);

    /** Admin: list profiles by verification status (defaults to PENDING when status is null). */
    Page<AdminVerificationCardDTO> getForReview(Integer status, Pageable pageable);

    AdminVerificationCardDTO approve(Integer userId);

    AdminVerificationCardDTO reject(Integer userId, String reason);

    long countByStatus(int status);
}