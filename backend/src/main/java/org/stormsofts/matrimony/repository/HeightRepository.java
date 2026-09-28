package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstHeight;


@Repository
public interface HeightRepository extends JpaRepository<MstHeight, Integer> {
}
