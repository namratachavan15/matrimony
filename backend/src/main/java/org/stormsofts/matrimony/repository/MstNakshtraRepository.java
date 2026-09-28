package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstNakshtra;

import java.util.List;

@Repository
public interface MstNakshtraRepository extends JpaRepository<MstNakshtra, Integer> {
    List<MstNakshtra> findByNakshtraContainingIgnoreCase(String keyword);
}