package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstPrivacySettings;

import java.util.Optional;

public interface MstPrivacySettingsRepository extends JpaRepository<MstPrivacySettings, Integer> {

    Optional<MstPrivacySettings> findByUserId(Integer userId);
}