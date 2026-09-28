package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstGan;


@Repository
public interface GanRepository extends JpaRepository<MstGan, Integer> {
}