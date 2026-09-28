package org.stormsofts.matrimony.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstProfileView;
import org.stormsofts.matrimony.model.ProfileViewDTO;

import java.util.List;




@Repository
public interface MstProfileViewRepository extends JpaRepository<MstProfileView, Integer> {

    @Query(value =
            "SELECT " +
                    " pv.PVID AS pvid, " +
                    " pv.PRID AS prid, " +
                    " profile.Uname AS username, " +
                    " profile.Umobile AS mobile " +   // <- removed trailing comma
                    "FROM mst_profile_view pv " +
                    "JOIN mst_users profile ON profile.UID = pv.PRID " +
                    "WHERE (:search = '' " +
                    "   OR profile.Uname LIKE CONCAT('%', :search, '%') " +
                    "   OR profile.Umobile LIKE CONCAT('%', :search, '%') " +
                    "   OR CAST(profile.UID AS CHAR) LIKE CONCAT('%', :search, '%') " +
                    ")",
            nativeQuery = true)
    List<Object[]> fetchViewedProfilesNative(@Param("search") String search);

    @Query(value = """
            SELECT pv.PVID AS pvid,
                   viewer.UID AS userId,
                   viewer.Uname AS username,
                   viewer.Umobile AS mobile,
                   viewer.uprofile AS photo
            FROM mst_profile_view pv
            JOIN mst_users viewer ON viewer.UID = pv.UID
            WHERE pv.PRID = :profileId
            """, nativeQuery = true)
    List<Object[]> findViewersByProfileId(@Param("profileId") Integer profileId);
}


