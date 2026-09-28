package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstOtherinfo;
import org.stormsofts.matrimony.repository.OtherinfoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class OtherinfoServiceImpl implements OtherinfoService {

    @Autowired
    private OtherinfoRepository repository;


    // Create
    public MstOtherinfo save(MstOtherinfo otherinfo) {
        return repository.save(otherinfo);
    }

    // Update
    public MstOtherinfo update(Integer id, MstOtherinfo otherinfo) {
        Optional<MstOtherinfo> existing = repository.findById(id);
        if (existing.isPresent()) {
            otherinfo.setId(id);
            return repository.save(otherinfo);
        }
        throw new RuntimeException("Otherinfo not found with id: " + id);
    }

    // Delete
    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Otherinfo not found with id: " + id);
        }
        repository.deleteById(id);
    }

    // Get all
    public List<MstOtherinfo> getAll() {
        return repository.findAll();
    }

    // Search (by UID or username)
    public List<MstOtherinfo> search(String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return repository.findAll();
        }
        return repository.searchByUidOrUsername(keyword.toLowerCase());
    }
    public Optional<MstOtherinfo> getOtherInfoByUserId(Integer uid) {
        return repository.findByUid(uid);
    }
    // Get by ID
    public MstOtherinfo getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Otherinfo not found with id: " + id));
    }
}


