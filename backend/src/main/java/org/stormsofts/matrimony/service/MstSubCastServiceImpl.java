package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstSubcast;
import org.stormsofts.matrimony.repository.MstSubcastRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MstSubCastServiceImpl implements MstSubcastService{

    @Autowired
    private  MstSubcastRepository subcastRepository;

    // INSERT
    public MstSubcast addSubcast(MstSubcast subcast) {
        if (subcast.getStatus() == null) {
            subcast.setStatus(1); // default active
        }
        return subcastRepository.save(subcast);
    }

    // UPDATE
    public MstSubcast updateSubcast(Integer id, MstSubcast updated) {
        MstSubcast existing = subcastRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcast not found with id: " + id));

        existing.setSubcast(updated.getSubcast());
        existing.setCtid(updated.getCtid());
        if (updated.getStatus() != null) {
            existing.setStatus(updated.getStatus());
        }

        return subcastRepository.save(existing);
    }

    // DELETE (hard delete)
    public void deleteSubcast(Integer id) {
        if (!subcastRepository.existsById(id)) {
            throw new RuntimeException("Subcast not found with id: " + id);
        }
        subcastRepository.deleteById(id);
    }



    // GET by ID
    public Optional<MstSubcast> getById(Integer id) {
        return subcastRepository.findById(id);
    }

    // LIST all
    public List<MstSubcast> getAll() {
        return subcastRepository.findAll();
    }

    // LIST only active
    public List<MstSubcast> getAllActive() {
        return subcastRepository.findByStatus(1);
    }

    // SEARCH by name (contains)
    public List<MstSubcast> searchByName(String name) {
        return subcastRepository.findBySubcastContainingIgnoreCase(name);
    }
}


