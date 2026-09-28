package org.stormsofts.matrimony.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.stormsofts.matrimony.model.ContactRequestResponseDTO;
import org.stormsofts.matrimony.model.MstContactRequest;

import java.util.Map;

public interface ContactRequestService {

    MstContactRequest sendRequest(Integer senderId, Integer receiverId);

    MstContactRequest acceptRequest(Integer requestId, Integer actingUserId);

    MstContactRequest declineRequest(Integer requestId, Integer actingUserId);

    MstContactRequest cancelRequest(Integer requestId, Integer actingUserId);

    ContactRequestResponseDTO getStatusBetween(Integer currentUserId, Integer otherUserId);

    Page<ContactRequestResponseDTO> getReceived(Integer userId, String statusFilter, Pageable pageable);

    Page<ContactRequestResponseDTO> getSent(Integer userId, Pageable pageable);

    long countPendingReceived(Integer userId);

    Map<Integer, String> getSentStatusMap(Integer userId);

    /** True if an ACCEPTED contact request exists between the two users, in either direction. */
    boolean isAccepted(Integer userA, Integer userB);
}
