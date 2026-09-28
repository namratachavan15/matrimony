package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstEducation;
import org.stormsofts.matrimony.repository.EducationRepository;

import java.util.List;

@Service
public class EducationServiceImpl  implements EducationService {

    @Autowired
    private EducationRepository educationRepository;

    public List<MstEducation> getAll() {
        return educationRepository.findAll();
    }

    public MstEducation getById(Integer id) {
        return educationRepository.findById(id).orElse(null);
    }

    public MstEducation create(MstEducation education) {
        return educationRepository.save(education);
    }

    public MstEducation update(Integer id, MstEducation updated) {
        return educationRepository.findById(id).map(e -> {
            e.setEducation(updated.getEducation());
            return educationRepository.save(e);
        }).orElse(null);
    }

    public void delete(Integer id) {
        educationRepository.deleteById(id);
    }
}


