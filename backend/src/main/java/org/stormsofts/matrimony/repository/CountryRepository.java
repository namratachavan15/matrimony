package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.stormsofts.matrimony.model.MstCountry;

import java.util.List;

public interface CountryRepository extends JpaRepository<MstCountry, Integer> {
    List<MstCountry> findByStatus(Integer status);
}