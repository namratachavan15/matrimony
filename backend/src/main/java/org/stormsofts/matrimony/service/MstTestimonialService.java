package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstTestimonial;

import java.util.List;
import java.util.Optional;

public interface MstTestimonialService {

    MstTestimonial saveTestimonial(MstTestimonial t);
    List<MstTestimonial> getAllTestimonials();
    Optional<MstTestimonial> getTestimonialById(Integer id);
    MstTestimonial updateTestimonial(Integer id, MstTestimonial t);
    void deleteTestimonial(Integer id);
}
