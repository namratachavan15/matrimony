package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstMarriage;
import org.stormsofts.matrimony.repository.MarriageRepository;

import java.io.Serial;
import java.util.List;
import java.util.Optional;

@Service
public class MarriageServiceImpl implements  MarriageService {

    @Autowired
    private MarriageRepository marriageRepository;

    public List<MstMarriage> getAllMarriages() {
        return marriageRepository.findAll();
    }

    public MstMarriage getMarriageById(Integer id) {
        return marriageRepository.findById(id).orElse(null);
    }

    public MstMarriage createMarriage(MstMarriage marriage) {
        return marriageRepository.save(marriage);
    }

    public MstMarriage updateMarriage(Integer id, MstMarriage updated) {
        Optional<MstMarriage> existing = marriageRepository.findById(id);
        if (existing.isPresent()) {
            MstMarriage m = existing.get();
            m.setMarriage(updated.getMarriage());
            m.setStatus(updated.getStatus());
            return marriageRepository.save(m);
        }
        return null;
    }

    public void deleteMarriage(Integer id) {
        marriageRepository.deleteById(id);
    }


}
