package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstRashi;


@Repository
public interface RashiRepository extends JpaRepository<MstRashi, Integer> {
}