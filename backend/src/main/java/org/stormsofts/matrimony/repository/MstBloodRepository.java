package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstBlood;

@Repository
public interface MstBloodRepository extends JpaRepository<MstBlood, Integer> {
}