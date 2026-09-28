package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstStory;
import org.stormsofts.matrimony.repository.MstStoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MstStoryServiceImpl implements MstStoryService {

    @Autowired
    private MstStoryRepository repository;

    @Override
    public MstStory saveStory(MstStory story) {
        return repository.save(story);
    }

    @Override
    public List<MstStory> getAllStories() {
        return repository.findAll();
    }

    @Override
    public List<MstStory> searchStories(String query) {
        return repository
                .findByBridenameContainingIgnoreCaseOrGroomnameContainingIgnoreCase(query, query);
    }

    @Override
    public void deleteStory(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public MstStory updateStory(Integer id, MstStory story) {
        MstStory old = repository.findById(id).orElseThrow();
        old.setBridename(story.getBridename());
        old.setGroomname(story.getGroomname());
        old.setMarriageDate(story.getMarriageDate());
        old.setFeedback(story.getFeedback());
        old.setStatus(story.getStatus());
        if (story.getSimg() != null) old.setSimg(story.getSimg());
        return repository.save(old);
    }

    @Override
    public Optional<MstStory> getStoryById(Integer id) {
        return repository.findById(id);
    }
}