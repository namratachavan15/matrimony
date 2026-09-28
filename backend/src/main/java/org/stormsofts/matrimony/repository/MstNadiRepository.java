package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstNadi;

import java.util.List;

public interface MstNadiRepository extends JpaRepository<MstNadi, Integer> {
    List<MstNadi> findByNadiContainingIgnoreCase(String keyword);
}

