package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstSavedSearch;

import java.util.List;
import java.util.Optional;

public interface MstSavedSearchRepository extends JpaRepository<MstSavedSearch, Integer> {

    List<MstSavedSearch> findByUserIdOrderByCreatedAtDesc(Integer userId);

    Optional<MstSavedSearch> findByIdAndUserId(Integer id, Integer userId);

    long countByUserId(Integer userId);
}