package org.stormsofts.matrimony.service;

import java.util.Set;

public interface LikeService {

    public boolean toggleLike(Integer userId, Integer likedUserId);
    public Set<Integer> getLikedUserIds(Integer userId);
}
