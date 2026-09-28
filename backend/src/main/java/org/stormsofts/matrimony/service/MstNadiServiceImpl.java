package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstNadi;
import org.stormsofts.matrimony.repository.MstNadiRepository;

import java.util.List;

@Service
public class MstNadiServiceImpl implements MstNadiService {

    @Autowired
    private MstNadiRepository nadiRepository;

    public List<MstNadi> getAll() {
        return nadiRepository.findAll();
    }

    public List<MstNadi> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return nadiRepository.findAll();
        }
        return nadiRepository.findByNadiContainingIgnoreCase(keyword.trim());
    }

    public MstNadi getById(Integer id) {
        return nadiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nadi not found with id " + id));
    }

    public MstNadi create(MstNadi nadi) {
        nadi.setId(null);
        return nadiRepository.save(nadi);
    }

    public MstNadi update(Integer id, MstNadi updated) {
        MstNadi existing = getById(id);
        existing.setNadi(updated.getNadi());
        return nadiRepository.save(existing);
    }

    public void delete(Integer id) {
        nadiRepository.deleteById(id);
    }
}
