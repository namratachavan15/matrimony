package org.stormsofts.matrimony.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstUser;
import org.stormsofts.matrimony.model.ProfileCardDTO;

import java.util.List;
import java.util.Optional;




@Repository
public interface MstUserRepository extends JpaRepository<MstUser, Integer> {

    List<MstUser> findByUmobileContaining(String mobile);
    List<MstUser> findByIdOrUmobile(Integer id, String mobile);
    Optional<MstUser> findByUmobileAndUpassAndUrole(String umobile, String upass, String urole);
    Optional<MstUser> findByUmobileAndUrole(String umobile, String urole);
    long countByGenderIgnoreCase(String gender);

    // ---- Safe, minimal profile-card projections (no mobile/email/aadhaar) ----
    // Used by Interests / Shortlist / Matches / Notifications / Block so those
    // features never have to pull (or accidentally expose) the full MstUser
    // entity. vstatus is included -- it's safe/intended to be public (it's
    // what powers the "Verified Profile" badge).
    @Query("select new org.stormsofts.matrimony.model.ProfileCardDTO(" +
            "u.id, u.uname, u.age, u.CLocation, u.educationDetails, u.currentWork, u.uprofile, u.vstatus) " +
            "from MstUser u where u.id = :id")
    Optional<ProfileCardDTO> findProfileCardById(@Param("id") Integer id);

    @Query("select new org.stormsofts.matrimony.model.ProfileCardDTO(" +
            "u.id, u.uname, u.age, u.CLocation, u.educationDetails, u.currentWork, u.uprofile, u.vstatus) " +
            "from MstUser u where u.id in :ids")
    List<ProfileCardDTO> findProfileCardsByIds(@Param("ids") List<Integer> ids);

    // ---- Profile Verification (Part 8) ----
    // vstatus: 0 = PENDING, 1 = VERIFIED, 2 = REJECTED (see VerificationService).
    Page<MstUser> findByVstatusOrderByJdateAsc(Integer vstatus, Pageable pageable);

    long countByVstatus(Integer vstatus);
}