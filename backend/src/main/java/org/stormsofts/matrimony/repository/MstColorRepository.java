package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstColor;


@Repository
public interface MstColorRepository extends JpaRepository<MstColor, Integer> {

}
