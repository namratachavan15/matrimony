package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstDistrict;

import java.util.List;

@Repository
public interface MstDistrictRepository extends JpaRepository<MstDistrict, Integer> {

    // all active districts
    List<MstDistrict> findByStatus(Integer status);

    // districts by state id
    List<MstDistrict> findByStid(String stid);

    // active districts by state id
    List<MstDistrict> findByStidAndStatus(String stid, Integer status);
}