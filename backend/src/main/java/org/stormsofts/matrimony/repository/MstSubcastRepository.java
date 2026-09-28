package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstSubcast;

import java.util.List;

@Repository
public interface MstSubcastRepository extends JpaRepository<MstSubcast, Integer> {

    // Search by subcast name (contains, case-insensitive)
    List<MstSubcast> findBySubcastContainingIgnoreCase(String subcast);

    // All active subcasts (status = 1)
    List<MstSubcast> findByStatus(Integer status);
}