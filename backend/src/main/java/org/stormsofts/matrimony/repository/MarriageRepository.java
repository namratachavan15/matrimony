package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstMarriage;


@Repository
public interface MarriageRepository extends JpaRepository<MstMarriage, Integer> {
}
