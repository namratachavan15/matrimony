package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.SavedSearchDTO;

import java.util.List;
import java.util.Map;

public interface SavedSearchService {

    List<SavedSearchDTO> getMySavedSearches(Integer userId);

    SavedSearchDTO save(Integer userId, String name, Map<String, Object> filters);

    SavedSearchDTO rename(Integer userId, Integer id, String newName);

    void delete(Integer userId, Integer id);
}