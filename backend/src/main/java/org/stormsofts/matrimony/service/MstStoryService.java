package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstStory;

import java.util.List;
import java.util.Optional;

public interface MstStoryService {

    MstStory saveStory(MstStory story);

    List<MstStory> getAllStories();

    List<MstStory> searchStories(String query);

    void deleteStory(Integer id);

    MstStory updateStory(Integer id, MstStory story);
    Optional<MstStory> getStoryById(Integer id);
}

