package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstEducation;


@Repository
public interface EducationRepository extends JpaRepository<MstEducation, Integer> {
}
