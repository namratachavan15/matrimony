package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstNakshtra;
import org.stormsofts.matrimony.repository.MstNakshtraRepository;

import java.util.List;

@Service
public class MstNakshtraServiceImpl implements MstNakshtraService {

    @Autowired
    private MstNakshtraRepository nakshtraRepository;

    public List<MstNakshtra> getAll() {
        return nakshtraRepository.findAll();
    }

    public List<MstNakshtra> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return nakshtraRepository.findAll();
        }
        return nakshtraRepository.findByNakshtraContainingIgnoreCase(keyword.trim());
    }

    public MstNakshtra getById(Integer id) {
        return nakshtraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nakshtra not found with id " + id));
    }

    public MstNakshtra create(MstNakshtra nakshtra) {
        nakshtra.setId(null);
        return nakshtraRepository.save(nakshtra);
    }

    public MstNakshtra update(Integer id, MstNakshtra updated) {
        MstNakshtra existing = getById(id);
        existing.setNakshtra(updated.getNakshtra());
        existing.setCtid(updated.getCtid());
        return nakshtraRepository.save(existing);
    }

    public void delete(Integer id) {
        nakshtraRepository.deleteById(id);
    }
}



