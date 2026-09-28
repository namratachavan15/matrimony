package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstTestimonial;
import org.stormsofts.matrimony.repository.MstTestimonialRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MstTestimonialServiceImpl implements MstTestimonialService {


    @Autowired
    private MstTestimonialRepository repo;



    @Override
    public MstTestimonial saveTestimonial(MstTestimonial t) {
        return repo.save(t);
    }

    @Override
    public List<MstTestimonial> getAllTestimonials() {
        return repo.findAll();
    }

    @Override
    public Optional<MstTestimonial> getTestimonialById(Integer id) {
        return repo.findById(id);
    }

    @Override
    public MstTestimonial updateTestimonial(Integer id, MstTestimonial t) {
        t.setId(id);
        return repo.save(t);
    }

    @Override
    public void deleteTestimonial(Integer id) {
        repo.deleteById(id);
    }
}