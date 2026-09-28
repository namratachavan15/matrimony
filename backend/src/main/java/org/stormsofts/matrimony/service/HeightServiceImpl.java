package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstHeight;
import org.stormsofts.matrimony.repository.HeightRepository;

import java.util.List;
import java.util.Optional;

@Service
public class HeightServiceImpl implements HeightService{

    @Autowired
    private HeightRepository heightRepository;

    public List<MstHeight> getAllHeights() {
        return heightRepository.findAll();
    }

    public MstHeight getHeightById(Integer id) {
        return heightRepository.findById(id).orElse(null);
    }

    public MstHeight createHeight(MstHeight height) {
        return heightRepository.save(height);
    }

    public MstHeight updateHeight(Integer id, MstHeight updated) {
        Optional<MstHeight> existing = heightRepository.findById(id);
        if (existing.isPresent()) {
            MstHeight h = existing.get();
            h.setHeight(updated.getHeight());
            h.setStatus(updated.getStatus());
            return heightRepository.save(h);
        }
        return null;
    }

    public void deleteHeight(Integer id) {
        heightRepository.deleteById(id);
    }
}



