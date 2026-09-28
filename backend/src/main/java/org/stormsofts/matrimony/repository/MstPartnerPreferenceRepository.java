package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstPartnerPreference;

import java.util.Optional;

public interface MstPartnerPreferenceRepository extends JpaRepository<MstPartnerPreference, Integer> {

    Optional<MstPartnerPreference> findByUserId(Integer userId);
}