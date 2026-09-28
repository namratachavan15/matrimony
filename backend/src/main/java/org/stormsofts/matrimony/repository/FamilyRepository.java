package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstFamily;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<MstFamily, Integer> {
    List<MstFamily> findByUid(Integer uid);
    List<MstFamily> findByFatherContainingIgnoreCaseOrMotherContainingIgnoreCase(String father, String mother);
}
