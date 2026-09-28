package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.InterestResponseDTO;
import org.stormsofts.matrimony.model.MstInterest;

public interface InterestService {

    MstInterest sendInterest(Integer senderId, Integer receiverId);

    MstInterest acceptInterest(Integer interestId, Integer actingUserId);

    MstInterest declineInterest(Integer interestId, Integer actingUserId);

    MstInterest cancelInterest(Integer interestId, Integer actingUserId);

    /** Current status of the interest between the two users, from either direction, or null if none exists. */
    InterestResponseDTO getStatusBetween(Integer currentUserId, Integer otherUserId);

    Page<InterestResponseDTO> getReceived(Integer userId, String statusFilter, Pageable pageable);

    Page<InterestResponseDTO> getSent(Integer userId, Pageable pageable);

    long countPendingReceived(Integer userId);

    /** receiverId -> "PENDING"/"ACCEPTED"/"DECLINED" for every interest the user has sent (bulk, for card grids). */
    java.util.Map<Integer, String> getSentStatusMap(Integer userId);
}
