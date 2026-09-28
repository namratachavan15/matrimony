package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstTestimonial;

@Repository
public interface MstTestimonialRepository extends JpaRepository<MstTestimonial, Integer> {
}
