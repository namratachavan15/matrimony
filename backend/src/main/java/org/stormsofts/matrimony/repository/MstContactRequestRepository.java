package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.ContactRequestStatus;
import org.stormsofts.matrimony.model.MstContactRequest;

import java.util.List;
import java.util.Optional;

public interface MstContactRequestRepository extends JpaRepository<MstContactRequest, Integer> {

    Optional<MstContactRequest> findBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    Page<MstContactRequest> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId, Pageable pageable);

    Page<MstContactRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(
            Integer receiverId, ContactRequestStatus status, Pageable pageable);

    Page<MstContactRequest> findBySenderIdOrderByCreatedAtDesc(Integer senderId, Pageable pageable);

    long countByReceiverIdAndStatus(Integer receiverId, ContactRequestStatus status);

    List<MstContactRequest> findBySenderIdAndStatusNot(Integer senderId, ContactRequestStatus excludedStatus);

    // Used by ChatService#canChat to check whether either direction has an
    // ACCEPTED contact request between the two users.
    List<MstContactRequest> findBySenderIdAndReceiverIdAndStatus(
            Integer senderId, Integer receiverId, ContactRequestStatus status);

    // Membership feature: count how many contact requests this user has
    // SENT since a given instant (start of the current month).
    long countBySenderIdAndCreatedAtAfterAndStatusNot(
            Integer senderId, java.time.Instant since, ContactRequestStatus excludedStatus);
}
