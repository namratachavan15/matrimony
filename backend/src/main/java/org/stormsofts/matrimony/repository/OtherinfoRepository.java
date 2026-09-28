package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstOtherinfo;

import java.util.List;
import java.util.Optional;


@Repository
public interface OtherinfoRepository extends JpaRepository<MstOtherinfo, Integer> {

    // Search by UID or username
    @Query("SELECT o FROM MstOtherinfo o JOIN MstUser u ON o.uid = u.id " +
            "WHERE (:keyword IS NULL OR CAST(o.uid AS string) LIKE %:keyword% OR LOWER(u.uname) LIKE %:keyword%)")
    List<MstOtherinfo> searchByUidOrUsername(@Param("keyword") String keyword);

    Optional<MstOtherinfo> findByUid(Integer uid);
}