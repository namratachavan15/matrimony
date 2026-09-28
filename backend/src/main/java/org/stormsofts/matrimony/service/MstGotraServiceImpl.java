package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstGotra;
import org.stormsofts.matrimony.repository.MstGotraRepository;

import java.util.List;

@Service
public class MstGotraServiceImpl implements MstGotraService  {

    @Autowired
    private MstGotraRepository gotraRepository;

    public List<MstGotra> getAll() {
        return gotraRepository.findAll();
    }

    public List<MstGotra> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return gotraRepository.findAll();
        }
        return gotraRepository.findByGotraContainingIgnoreCase(keyword.trim());
    }

    public MstGotra getById(Integer id) {
        return gotraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gotra not found with id " + id));
    }

    public MstGotra create(MstGotra gotra) {
        gotra.setId(null);
        return gotraRepository.save(gotra);
    }

    public MstGotra update(Integer id, MstGotra updated) {
        MstGotra existing = getById(id);
        existing.setGotra(updated.getGotra());
        existing.setCtid(updated.getCtid());
        return gotraRepository.save(existing);
    }

    public void delete(Integer id) {
        gotraRepository.deleteById(id);
    }

}
