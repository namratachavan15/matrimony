package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstGotra;

import java.util.List;

public interface MstGotraRepository extends JpaRepository<MstGotra, Integer> {

    List<MstGotra> findByGotraContainingIgnoreCase(String keyword);

}