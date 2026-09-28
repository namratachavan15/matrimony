package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstContactRequestRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactRequestServiceImpl implements ContactRequestService {

    @Autowired
    private MstContactRequestRepository contactRequestRepository;

    @Autowired
    private MstUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private BlockService blockService;

    @Autowired
    private MembershipLimitService membershipLimitService;

    @Override
    @Transactional
    public MstContactRequest sendRequest(Integer senderId, Integer receiverId) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("You cannot request your own contact details.");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new java.util.NoSuchElementException("User not found.");
        }
        if (blockService.isBlockedEitherWay(senderId, receiverId)) {
            throw new IllegalStateException("You cannot request contact from this profile.");
        }
        membershipLimitService.assertCanSendContactRequest(senderId);

        Optional<MstContactRequest> existingOpt = contactRequestRepository.findBySenderIdAndReceiverId(senderId, receiverId);

        if (existingOpt.isPresent()) {
            MstContactRequest existing = existingOpt.get();
            if (existing.getStatus() == ContactRequestStatus.PENDING || existing.getStatus() == ContactRequestStatus.ACCEPTED) {
                throw new IllegalStateException("CONTACT_REQUEST_ALREADY_EXISTS:" + existing.getStatus());
            }
            // Previously DECLINED/CANCELLED -- allow re-requesting by resetting the same row.
            existing.setStatus(ContactRequestStatus.PENDING);
            existing.setUpdatedAt(Instant.now());
            MstContactRequest saved = contactRequestRepository.save(existing);
            sendRequestNotification(saved);
            return saved;
        }

        MstContactRequest request = new MstContactRequest();
        request.setSenderId(senderId);
        request.setReceiverId(receiverId);
        request.setStatus(ContactRequestStatus.PENDING);
        MstContactRequest saved = contactRequestRepository.save(request);
        sendRequestNotification(saved);
        return saved;
    }

    private void sendRequestNotification(MstContactRequest request) {
        ProfileCardDTO sender = userRepository.findProfileCardById(request.getSenderId()).orElse(null);
        String senderName = sender != null ? sender.getUname() : "Someone";
        notificationService.notify(
                request.getReceiverId(),
                NotificationType.CONTACT_REQUEST_RECEIVED,
                "New Contact Request",
                senderName + " wants to connect and view your contact details.",
                request.getSenderId(),
                request.getId()
        );
    }

    @Override
    @Transactional
    public MstContactRequest acceptRequest(Integer requestId, Integer actingUserId) {
        MstContactRequest request = getRequest(requestId);
        if (!request.getReceiverId().equals(actingUserId)) {
            throw new SecurityException("Only the receiver can accept this contact request.");
        }
        if (request.getStatus() != ContactRequestStatus.PENDING) {
            throw new IllegalStateException("Only a pending contact request can be accepted.");
        }
        request.setStatus(ContactRequestStatus.ACCEPTED);
        request.setUpdatedAt(Instant.now());
        MstContactRequest saved = contactRequestRepository.save(request);

        ProfileCardDTO receiver = userRepository.findProfileCardById(request.getReceiverId()).orElse(null);
        String receiverName = receiver != null ? receiver.getUname() : "Someone";
        notificationService.notify(
                request.getSenderId(),
                NotificationType.CONTACT_REQUEST_ACCEPTED,
                "Contact Request Accepted",
                receiverName + " accepted your contact request. You can now chat and view contact details.",
                request.getReceiverId(),
                request.getId()
        );
        return saved;
    }

    @Override
    @Transactional
    public MstContactRequest declineRequest(Integer requestId, Integer actingUserId) {
        MstContactRequest request = getRequest(requestId);
        if (!request.getReceiverId().equals(actingUserId)) {
            throw new SecurityException("Only the receiver can decline this contact request.");
        }
        if (request.getStatus() != ContactRequestStatus.PENDING) {
            throw new IllegalStateException("Only a pending contact request can be declined.");
        }
        request.setStatus(ContactRequestStatus.DECLINED);
        request.setUpdatedAt(Instant.now());
        return contactRequestRepository.save(request);
    }

    @Override
    @Transactional
    public MstContactRequest cancelRequest(Integer requestId, Integer actingUserId) {
        MstContactRequest request = getRequest(requestId);
        if (!request.getSenderId().equals(actingUserId)) {
            throw new SecurityException("Only the sender can cancel this contact request.");
        }
        if (request.getStatus() != ContactRequestStatus.PENDING) {
            throw new IllegalStateException("Only a pending contact request can be cancelled.");
        }
        request.setStatus(ContactRequestStatus.CANCELLED);
        request.setUpdatedAt(Instant.now());
        return contactRequestRepository.save(request);
    }

    private MstContactRequest getRequest(Integer requestId) {
        return contactRequestRepository.findById(requestId)
                .orElseThrow(() -> new java.util.NoSuchElementException("Contact request not found."));
    }

    @Override
    public ContactRequestResponseDTO getStatusBetween(Integer currentUserId, Integer otherUserId) {
        Optional<MstContactRequest> asSender = contactRequestRepository.findBySenderIdAndReceiverId(currentUserId, otherUserId);
        Optional<MstContactRequest> asReceiver = contactRequestRepository.findBySenderIdAndReceiverId(otherUserId, currentUserId);

        MstContactRequest request = asSender.filter(r -> r.getStatus() != ContactRequestStatus.CANCELLED)
                .orElse(asReceiver.filter(r -> r.getStatus() != ContactRequestStatus.CANCELLED).orElse(null));

        if (request == null) return null;

        ProfileCardDTO otherCard = userRepository.findProfileCardById(otherUserId).orElse(null);
        return toDto(request, otherCard);
    }

    @Override
    public Page<ContactRequestResponseDTO> getReceived(Integer userId, String statusFilter, Pageable pageable) {
        Page<MstContactRequest> page;
        if (statusFilter != null && !statusFilter.isBlank() && !"ALL".equalsIgnoreCase(statusFilter)) {
            page = contactRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(
                    userId, ContactRequestStatus.valueOf(statusFilter.toUpperCase()), pageable);
        } else {
            page = contactRequestRepository.findByReceiverIdOrderByCreatedAtDesc(userId, pageable);
        }
        return page.map(r -> toDto(r, userRepository.findProfileCardById(r.getSenderId()).orElse(null)));
    }

    @Override
    public Page<ContactRequestResponseDTO> getSent(Integer userId, Pageable pageable) {
        Page<MstContactRequest> page = contactRequestRepository.findBySenderIdOrderByCreatedAtDesc(userId, pageable);
        return page.map(r -> toDto(r, userRepository.findProfileCardById(r.getReceiverId()).orElse(null)));
    }

    @Override
    public long countPendingReceived(Integer userId) {
        return contactRequestRepository.countByReceiverIdAndStatus(userId, ContactRequestStatus.PENDING);
    }

    @Override
    public Map<Integer, String> getSentStatusMap(Integer userId) {
        return contactRequestRepository.findBySenderIdAndStatusNot(userId, ContactRequestStatus.CANCELLED).stream()
                .collect(Collectors.toMap(
                        MstContactRequest::getReceiverId,
                        r -> r.getStatus().name(),
                        (a, b) -> b
                ));
    }

    @Override
    public boolean isAccepted(Integer userA, Integer userB) {
        List<MstContactRequest> forward = contactRequestRepository.findBySenderIdAndReceiverIdAndStatus(
                userA, userB, ContactRequestStatus.ACCEPTED);
        if (!forward.isEmpty()) return true;
        List<MstContactRequest> backward = contactRequestRepository.findBySenderIdAndReceiverIdAndStatus(
                userB, userA, ContactRequestStatus.ACCEPTED);
        return !backward.isEmpty();
    }

    private ContactRequestResponseDTO toDto(MstContactRequest r, ProfileCardDTO otherUser) {
        return new ContactRequestResponseDTO(r.getId(), r.getStatus(), r.getSenderId(), r.getReceiverId(),
                otherUser, r.getCreatedAt(), r.getUpdatedAt());
    }
}
