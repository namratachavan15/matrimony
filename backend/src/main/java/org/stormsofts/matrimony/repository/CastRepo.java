package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstCast;

import java.util.List;
import java.util.Optional;

@Repository
public interface CastRepo extends JpaRepository<MstCast,Integer> {

    Optional<MstCast> findByCast(String castName);
    List<MstCast> findByCastContainingIgnoreCase(String cast);

}
