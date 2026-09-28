package org.stormsofts.matrimony.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stormsofts.matrimony.model.MstSavedSearch;
import org.stormsofts.matrimony.model.SavedSearchDTO;
import org.stormsofts.matrimony.repository.MstSavedSearchRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class SavedSearchServiceImpl implements SavedSearchService {

    private static final int MAX_SAVED_SEARCHES_PER_USER = 20;

    @Autowired
    private MstSavedSearchRepository repository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public List<SavedSearchDTO> getMySavedSearches(Integer userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public SavedSearchDTO save(Integer userId, String name, Map<String, Object> filters) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Please give this search a name.");
        }
        if (repository.countByUserId(userId) >= MAX_SAVED_SEARCHES_PER_USER) {
            throw new IllegalStateException("You've reached the limit of " + MAX_SAVED_SEARCHES_PER_USER + " saved searches. Delete one first.");
        }

        MstSavedSearch s = new MstSavedSearch();
        s.setUserId(userId);
        s.setName(name.trim());
        s.setFiltersJson(writeJson(filters));
        s = repository.save(s);
        return toDTO(s);
    }

    @Override
    @Transactional
    public SavedSearchDTO rename(Integer userId, Integer id, String newName) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Please give this search a name.");
        }
        MstSavedSearch s = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NoSuchElementException("Saved search not found."));
        s.setName(newName.trim());
        s = repository.save(s);
        return toDTO(s);
    }

    @Override
    @Transactional
    public void delete(Integer userId, Integer id) {
        MstSavedSearch s = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NoSuchElementException("Saved search not found."));
        repository.delete(s);
    }

    private String writeJson(Map<String, Object> filters) {
        try {
            return mapper.writeValueAsString(filters == null ? Collections.emptyMap() : filters);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not save these filters.");
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> readJson(String json) {
        try {
            return mapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private SavedSearchDTO toDTO(MstSavedSearch s) {
        return new SavedSearchDTO(s.getId(), s.getName(), readJson(s.getFiltersJson()), s.getCreatedAt());
    }
}