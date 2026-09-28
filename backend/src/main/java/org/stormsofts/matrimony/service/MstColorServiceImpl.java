package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstColor;
import org.stormsofts.matrimony.repository.MstColorRepository;

import java.util.List;

@Service
public class MstColorServiceImpl implements MstColorService {

    @Autowired
    private MstColorRepository mstColorRepository;



    public List<MstColor> getAllColors() {
        return mstColorRepository.findAll();
    }

    public MstColor addColor(MstColor color) {
        return mstColorRepository.save(color);
    }
}
