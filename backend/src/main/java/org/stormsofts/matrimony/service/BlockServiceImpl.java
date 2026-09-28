package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstBlockedUser;
import org.stormsofts.matrimony.model.ProfileCardDTO;
import org.stormsofts.matrimony.repository.MstBlockedUserRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BlockServiceImpl implements BlockService {

    @Autowired
    private MstBlockedUserRepository blockedUserRepository;

    @Autowired
    private MstUserRepository userRepository;

    @Override
    @Transactional
    public void block(Integer blockerId, Integer blockedUserId) {
        if (blockerId == null || blockedUserId == null) {
            throw new IllegalArgumentException("Invalid user.");
        }
        if (blockerId.equals(blockedUserId)) {
            throw new IllegalArgumentException("You cannot block yourself.");
        }
        if (blockedUserRepository.existsByBlockerIdAndBlockedUserId(blockerId, blockedUserId)) {
            return; // already blocked -- idempotent
        }
        MstBlockedUser b = new MstBlockedUser();
        b.setBlockerId(blockerId);
        b.setBlockedUserId(blockedUserId);
        blockedUserRepository.save(b);
    }

    @Override
    @Transactional
    public void unblock(Integer blockerId, Integer blockedUserId) {
        blockedUserRepository.findByBlockerIdAndBlockedUserId(blockerId, blockedUserId)
                .ifPresent(blockedUserRepository::delete);
    }

    @Override
    public boolean isBlockedByMe(Integer blockerId, Integer otherUserId) {
        if (blockerId == null || otherUserId == null) return false;
        return blockedUserRepository.existsByBlockerIdAndBlockedUserId(blockerId, otherUserId);
    }

    @Override
    public boolean isBlockedEitherWay(Integer userA, Integer userB) {
        if (userA == null || userB == null) return false;
        return blockedUserRepository.existsByBlockerIdAndBlockedUserId(userA, userB)
                || blockedUserRepository.existsByBlockerIdAndBlockedUserId(userB, userA);
    }

    @Override
    public Set<Integer> getBlockedUserIds(Integer blockerId) {
        return blockedUserRepository.findByBlockerId(blockerId).stream()
                .map(MstBlockedUser::getBlockedUserId)
                .collect(Collectors.toSet());
    }

    @Override
    public Page<ProfileCardDTO> getMyBlockedProfiles(Integer blockerId, Pageable pageable) {
        Page<MstBlockedUser> page = blockedUserRepository.findByBlockerIdOrderByCreatedAtDesc(blockerId, pageable);
        List<Integer> ids = page.getContent().stream().map(MstBlockedUser::getBlockedUserId).toList();
        List<ProfileCardDTO> cards = ids.isEmpty() ? List.of() : userRepository.findProfileCardsByIds(ids);
        return page.map(b -> cards.stream()
                .filter(c -> c.getId().equals(b.getBlockedUserId()))
                .findFirst()
                .orElse(null));
    }

    @Override
    public long countForUser(Integer blockerId) {
        return blockedUserRepository.countByBlockerId(blockerId);
    }
}
