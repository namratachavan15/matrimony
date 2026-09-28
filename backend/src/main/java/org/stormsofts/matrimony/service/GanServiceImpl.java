package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstGan;
import org.stormsofts.matrimony.repository.GanRepository;

import java.util.List;

@Service
public class GanServiceImpl implements   GanService{

    @Autowired
    private GanRepository ganRepository;

    public MstGan createGan(MstGan gan) {
        return ganRepository.save(gan);
    }

    public List<MstGan> getAllGans() {
        return ganRepository.findAll();
    }

    public MstGan updateGan(Integer id, MstGan ganDetails) {
        MstGan gan = ganRepository.findById(id).orElseThrow(() -> new RuntimeException("Gan not found"));
        gan.setGan(ganDetails.getGan());
        gan.setCtid(ganDetails.getCtid());
        return ganRepository.save(gan);
    }

    public void deleteGan(Integer id) {
        ganRepository.deleteById(id);
    }
}
