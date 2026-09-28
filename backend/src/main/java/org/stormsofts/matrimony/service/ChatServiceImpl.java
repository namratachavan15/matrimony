package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.*;
import org.stormsofts.matrimony.repository.MstConversationRepository;
import org.stormsofts.matrimony.repository.MstInterestRepository;
import org.stormsofts.matrimony.repository.MstMatchRepository;
import org.stormsofts.matrimony.repository.MstMessageRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private MstConversationRepository conversationRepository;

    @Autowired
    private MstMessageRepository messageRepository;

    @Autowired
    private MstMatchRepository matchRepository;

    @Autowired
    private MstInterestRepository interestRepository;

    @Autowired
    private ContactRequestService contactRequestService;

    @Autowired
    private BlockService blockService;

    @Autowired
    private MstUserRepository userRepository;

    @Override
    public boolean canChat(Integer userA, Integer userB) {
        if (userA == null || userB == null || userA.equals(userB)) return false;
        if (blockService.isBlockedEitherWay(userA, userB)) return false;

        Integer userOne = Math.min(userA, userB);
        Integer userTwo = Math.max(userA, userB);
        if (matchRepository.findByUserOneIdAndUserTwoId(userOne, userTwo).isPresent()) return true;

        if (isAcceptedInterest(userA, userB) || isAcceptedInterest(userB, userA)) return true;

        return contactRequestService.isAccepted(userA, userB);
    }

    private boolean isAcceptedInterest(Integer senderId, Integer receiverId) {
        Optional<MstInterest> interest = interestRepository.findBySenderIdAndReceiverId(senderId, receiverId);
        return interest.isPresent() && interest.get().getStatus() == InterestStatus.ACCEPTED;
    }

    @Override
    @Transactional
    public MstMessage sendMessage(Integer senderId, Integer receiverId, String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty.");
        }
        if (content.length() > 2000) {
            throw new IllegalArgumentException("Message is too long.");
        }
        if (!userRepository.existsById(receiverId)) {
            throw new java.util.NoSuchElementException("User not found.");
        }
        if (!canChat(senderId, receiverId)) {
            throw new IllegalStateException("You can only message profiles you have matched with, " +
                    "or whose interest / contact request has been accepted.");
        }

        MstConversation conversation = getOrCreateConversation(senderId, receiverId);

        MstMessage message = new MstMessage();
        message.setConversationId(conversation.getId());
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content.trim());
        message.setRead(false);
        MstMessage saved = messageRepository.save(message);

        String preview = saved.getContent().length() > 120
                ? saved.getContent().substring(0, 120) + "..."
                : saved.getContent();
        conversation.setLastMessageAt(saved.getCreatedAt());
        conversation.setLastMessagePreview(preview);
        conversationRepository.save(conversation);

        return saved;
    }

    private MstConversation getOrCreateConversation(Integer userA, Integer userB) {
        Integer userOne = Math.min(userA, userB);
        Integer userTwo = Math.max(userA, userB);
        return conversationRepository.findByUserOneIdAndUserTwoId(userOne, userTwo)
                .orElseGet(() -> {
                    MstConversation c = new MstConversation();
                    c.setUserOneId(userOne);
                    c.setUserTwoId(userTwo);
                    return conversationRepository.save(c);
                });
    }

    @Override
    public Page<ConversationDTO> getMyConversations(Integer userId, Pageable pageable) {
        Page<MstConversation> page = conversationRepository.findAllForUser(userId, pageable);

        List<Integer> otherIds = page.getContent().stream()
                .map(c -> c.getUserOneId().equals(userId) ? c.getUserTwoId() : c.getUserOneId())
                .toList();

        List<ProfileCardDTO> cards = otherIds.isEmpty()
                ? List.of()
                : userRepository.findProfileCardsByIds(otherIds);

        return page.map(c -> {
            Integer otherId = c.getUserOneId().equals(userId) ? c.getUserTwoId() : c.getUserOneId();
            ProfileCardDTO card = cards.stream()
                    .filter(card2 -> card2.getId().equals(otherId))
                    .findFirst()
                    .orElse(null);
            long unread = messageRepository.countByConversationIdAndReceiverIdAndReadFalse(c.getId(), userId);
            return new ConversationDTO(c.getId(), card, c.getLastMessagePreview(), c.getLastMessageAt(), unread);
        });
    }

    @Override
    public Page<MstMessage> getMessages(Integer conversationId, Integer userId, Pageable pageable) {
        MstConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new java.util.NoSuchElementException("Conversation not found."));
        if (!conversation.getUserOneId().equals(userId) && !conversation.getUserTwoId().equals(userId)) {
            throw new SecurityException("You are not a participant of this conversation.");
        }
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
    }

    @Override
    @Transactional
    public Integer getOrCreateConversationId(Integer userId, Integer otherUserId) {
        if (!canChat(userId, otherUserId)) {
            throw new IllegalStateException("You can only message profiles you have matched with, " +
                    "or whose interest / contact request has been accepted.");
        }
        return getOrCreateConversation(userId, otherUserId).getId();
    }

    @Override
    @Transactional
    public void markConversationRead(Integer conversationId, Integer userId) {
        MstConversation conversation = conversationRepository.findById(conversationId).orElse(null);
        if (conversation == null) return;
        if (!conversation.getUserOneId().equals(userId) && !conversation.getUserTwoId().equals(userId)) {
            throw new SecurityException("You are not a participant of this conversation.");
        }
        messageRepository.markConversationRead(conversationId, userId, Instant.now());
    }

    @Override
    public long getUnreadMessageCount(Integer userId) {
        return messageRepository.countByReceiverIdAndReadFalse(userId);
    }
}
