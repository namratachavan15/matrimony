package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstMatch;
import org.stormsofts.matrimony.repository.MstMatchRepository;

@Service
public class MatchServiceImpl implements MatchService {

    @Autowired
    private MstMatchRepository matchRepository;

    @Override
    @Transactional
    public MatchResult createMatchIfAbsent(Integer userAId, Integer userBId) {
        Integer userOne = Math.min(userAId, userBId);
        Integer userTwo = Math.max(userAId, userBId);

        return matchRepository.findByUserOneIdAndUserTwoId(userOne, userTwo)
                .map(existing -> new MatchResult(existing, false))
                .orElseGet(() -> {
                    MstMatch match = new MstMatch();
                    match.setUserOneId(userOne);
                    match.setUserTwoId(userTwo);
                    MstMatch saved = matchRepository.save(match);
                    return new MatchResult(saved, true);
                });
    }

    @Override
    public Page<MstMatch> getMyMatches(Integer userId, Pageable pageable) {
        return matchRepository.findAllForUser(userId, pageable);
    }

    @Override
    public long countForUser(Integer userId) {
        return matchRepository.countForUser(userId);
    }
}
