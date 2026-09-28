package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstHeightBetween;

import java.util.List;

@Repository
public interface HeightBetweenRepository extends JpaRepository<MstHeightBetween, Integer> {
    List<MstHeightBetween> findByStatus(Integer status); // fetch only active heights
}