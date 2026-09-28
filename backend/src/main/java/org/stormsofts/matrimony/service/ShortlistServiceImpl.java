package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstShortlist;
import org.stormsofts.matrimony.model.ProfileCardDTO;
import org.stormsofts.matrimony.repository.MstShortlistRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShortlistServiceImpl implements ShortlistService {

    @Autowired
    private MstShortlistRepository shortlistRepository;

    @Autowired
    private MstUserRepository userRepository;

    @Override
    @Transactional
    public boolean toggleShortlist(Integer userId, Integer shortlistedUserId) {
        return shortlistRepository.findByUserIdAndShortlistedUserId(userId, shortlistedUserId)
                .map(existing -> {
                    shortlistRepository.delete(existing);
                    return false;
                })
                .orElseGet(() -> {
                    MstShortlist s = new MstShortlist();
                    s.setUserId(userId);
                    s.setShortlistedUserId(shortlistedUserId);
                    shortlistRepository.save(s);
                    return true;
                });
    }

    @Override
    public Set<Integer> getShortlistedUserIds(Integer userId) {
        return shortlistRepository.findByUserId(userId).stream()
                .map(MstShortlist::getShortlistedUserId)
                .collect(Collectors.toSet());
    }

    @Override
    public Page<ProfileCardDTO> getMyShortlist(Integer userId, Pageable pageable) {
        Page<MstShortlist> page = shortlistRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<Integer> ids = page.getContent().stream().map(MstShortlist::getShortlistedUserId).toList();
        List<ProfileCardDTO> cards = ids.isEmpty() ? List.of() : userRepository.findProfileCardsByIds(ids);
        return page.map(s -> cards.stream()
                .filter(c -> c.getId().equals(s.getShortlistedUserId()))
                .findFirst()
                .orElse(null));
    }

    @Override
    public long countForUser(Integer userId) {
        return shortlistRepository.countByUserId(userId);
    }
}
