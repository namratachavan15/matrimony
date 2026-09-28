package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstCountry;

import java.util.List;

@Repository
public interface MstCountryRepository extends JpaRepository<MstCountry, Integer> {

    // Optional: only active countries
    List<MstCountry> findByStatus(Integer status);
}