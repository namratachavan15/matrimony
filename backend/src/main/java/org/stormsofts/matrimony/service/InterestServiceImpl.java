package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstInterestRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.time.Instant;
import java.util.Optional;

@Service
public class InterestServiceImpl implements InterestService {

    @Autowired
    private MstInterestRepository interestRepository;

    @Autowired
    private MstUserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MatchService matchService;

    @Autowired
    private BlockService blockService;

    @Autowired
    private MembershipLimitService membershipLimitService;

    @Override
    @Transactional
    public MstInterest sendInterest(Integer senderId, Integer receiverId) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("You cannot send interest to yourself.");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new java.util.NoSuchElementException("User not found.");
        }
        if (blockService.isBlockedEitherWay(senderId, receiverId)) {
            // Part 7: a blocked user must not be able to send interest either way.
            throw new IllegalStateException("You cannot send interest to this profile.");
        }
        membershipLimitService.assertCanSendInterest(senderId);

        Optional<MstInterest> existingOpt = interestRepository.findBySenderIdAndReceiverId(senderId, receiverId);

        if (existingOpt.isPresent()) {
            MstInterest existing = existingOpt.get();
            if (existing.getStatus() == InterestStatus.PENDING || existing.getStatus() == InterestStatus.ACCEPTED) {
                // Duplicate pending/already-accepted interest must not be re-created.
                throw new IllegalStateException("INTEREST_ALREADY_EXISTS:" + existing.getStatus());
            }
            // Previously DECLINED/CANCELLED -- allow re-sending by resetting the same row.
            existing.setStatus(InterestStatus.PENDING);
            existing.setUpdatedAt(Instant.now());
            MstInterest saved = interestRepository.save(existing);
            sendInterestNotification(saved);
            return saved;
        }

        MstInterest interest = new MstInterest();
        interest.setSenderId(senderId);
        interest.setReceiverId(receiverId);
        interest.setStatus(InterestStatus.PENDING);
        MstInterest saved = interestRepository.save(interest);
        sendInterestNotification(saved);
        return saved;
    }

    private void sendInterestNotification(MstInterest interest) {
        ProfileCardDTO sender = userRepository.findProfileCardById(interest.getSenderId()).orElse(null);
        String senderName = sender != null ? sender.getUname() : "Someone";
        notificationService.notify(
                interest.getReceiverId(),
                NotificationType.INTEREST_RECEIVED,
                "New Interest Received",
                senderName + " has expressed interest in your profile.",
                interest.getSenderId(),
                interest.getId()
        );
    }

    @Override
    @Transactional
    public MstInterest acceptInterest(Integer interestId, Integer actingUserId) {
        MstInterest interest = getOwnedInterest(interestId);
        if (!interest.getReceiverId().equals(actingUserId)) {
            throw new SecurityException("Only the receiver can accept this interest.");
        }
        if (interest.getStatus() != InterestStatus.PENDING) {
            throw new IllegalStateException("Only a pending interest can be accepted.");
        }
        interest.setStatus(InterestStatus.ACCEPTED);
        interest.setUpdatedAt(Instant.now());
        MstInterest saved = interestRepository.save(interest);

        ProfileCardDTO receiver = userRepository.findProfileCardById(interest.getReceiverId()).orElse(null);
        String receiverName = receiver != null ? receiver.getUname() : "Someone";
        notificationService.notify(
                interest.getSenderId(),
                NotificationType.INTEREST_ACCEPTED,
                "Interest Accepted",
                receiverName + " accepted your interest!",
                interest.getReceiverId(),
                interest.getId()
        );

        MatchService.MatchResult matchResult = matchService.createMatchIfAbsent(interest.getSenderId(), interest.getReceiverId());
        if (matchResult.isNewlyCreated()) {
            ProfileCardDTO sender = userRepository.findProfileCardById(interest.getSenderId()).orElse(null);
            notificationService.notify(interest.getSenderId(), NotificationType.MUTUAL_MATCH,
                    "It's a Match!", "You have a new match with " + (receiver != null ? receiver.getUname() : "someone") + ".",
                    interest.getReceiverId(), matchResult.getMatch().getId());
            notificationService.notify(interest.getReceiverId(), NotificationType.MUTUAL_MATCH,
                    "It's a Match!", "You have a new match with " + (sender != null ? sender.getUname() : "someone") + ".",
                    interest.getSenderId(), matchResult.getMatch().getId());
        }

        return saved;
    }

    @Override
    @Transactional
    public MstInterest declineInterest(Integer interestId, Integer actingUserId) {
        MstInterest interest = getOwnedInterest(interestId);
        if (!interest.getReceiverId().equals(actingUserId)) {
            throw new SecurityException("Only the receiver can decline this interest.");
        }
        if (interest.getStatus() != InterestStatus.PENDING) {
            throw new IllegalStateException("Only a pending interest can be declined.");
        }
        interest.setStatus(InterestStatus.DECLINED);
        interest.setUpdatedAt(Instant.now());
        MstInterest saved = interestRepository.save(interest);

        notificationService.notify(
                interest.getSenderId(),
                NotificationType.INTEREST_DECLINED,
                "Interest Declined",
                "Your interest was declined.",
                interest.getReceiverId(),
                interest.getId()
        );
        return saved;
    }

    @Override
    @Transactional
    public MstInterest cancelInterest(Integer interestId, Integer actingUserId) {
        MstInterest interest = getOwnedInterest(interestId);
        if (!interest.getSenderId().equals(actingUserId)) {
            throw new SecurityException("Only the sender can cancel this interest.");
        }
        if (interest.getStatus() != InterestStatus.PENDING) {
            throw new IllegalStateException("Only a pending interest can be cancelled.");
        }
        interest.setStatus(InterestStatus.CANCELLED);
        interest.setUpdatedAt(Instant.now());
        return interestRepository.save(interest);
    }

    private MstInterest getOwnedInterest(Integer interestId) {
        return interestRepository.findById(interestId)
                .orElseThrow(() -> new java.util.NoSuchElementException("Interest not found."));
    }

    @Override
    public InterestResponseDTO getStatusBetween(Integer currentUserId, Integer otherUserId) {
        Optional<MstInterest> asSender = interestRepository.findBySenderIdAndReceiverId(currentUserId, otherUserId);
        Optional<MstInterest> asReceiver = interestRepository.findBySenderIdAndReceiverId(otherUserId, currentUserId);

        MstInterest interest = asSender.filter(i -> i.getStatus() != InterestStatus.CANCELLED)
                .orElse(asReceiver.filter(i -> i.getStatus() != InterestStatus.CANCELLED).orElse(null));

        if (interest == null) return null;

        ProfileCardDTO otherCard = userRepository.findProfileCardById(otherUserId).orElse(null);
        return toDto(interest, otherCard);
    }

    @Override
    public Page<InterestResponseDTO> getReceived(Integer userId, String statusFilter, Pageable pageable) {
        Page<MstInterest> page;
        if (statusFilter != null && !statusFilter.isBlank() && !"ALL".equalsIgnoreCase(statusFilter)) {
            page = interestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(
                    userId, InterestStatus.valueOf(statusFilter.toUpperCase()), pageable);
        } else {
            page = interestRepository.findByReceiverIdOrderByCreatedAtDesc(userId, pageable);
        }
        return page.map(i -> toDto(i, userRepository.findProfileCardById(i.getSenderId()).orElse(null)));
    }

    @Override
    public Page<InterestResponseDTO> getSent(Integer userId, Pageable pageable) {
        Page<MstInterest> page = interestRepository.findBySenderIdOrderByCreatedAtDesc(userId, pageable);
        return page.map(i -> toDto(i, userRepository.findProfileCardById(i.getReceiverId()).orElse(null)));
    }

    @Override
    public long countPendingReceived(Integer userId) {
        return interestRepository.countByReceiverIdAndStatus(userId, InterestStatus.PENDING);
    }

    @Override
    public java.util.Map<Integer, String> getSentStatusMap(Integer userId) {
        return interestRepository.findBySenderIdAndStatusNot(userId, InterestStatus.CANCELLED).stream()
                .collect(java.util.stream.Collectors.toMap(
                        MstInterest::getReceiverId,
                        i -> i.getStatus().name(),
                        (a, b) -> b // shouldn't happen (unique sender/receiver), keep latest just in case
                ));
    }

    private InterestResponseDTO toDto(MstInterest i, ProfileCardDTO otherUser) {
        return new InterestResponseDTO(i.getId(), i.getStatus(), i.getSenderId(), i.getReceiverId(),
                otherUser, i.getCreatedAt(), i.getUpdatedAt());
    }
}
