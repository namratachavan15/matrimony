package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstState;

import java.util.List;

@Repository
public interface MstStateRepository extends JpaRepository<MstState, Integer> {
    // All states by country
    List<MstState> findByCnid(Integer cnid);

    // Only active states by country (status = 1)
    List<MstState> findByCnidAndStatus(Integer cnid, Integer status);
}