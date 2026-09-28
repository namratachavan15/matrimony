package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstHeightBetween;
import org.stormsofts.matrimony.repository.HeightBetweenRepository;

import java.util.List;


@Service
public class HeightBetweenServiceImpl implements   HeightBetweenService{


    @Autowired
    private  HeightBetweenRepository heightRepository;



    public List<MstHeightBetween> getAllHeights() {
        return heightRepository.findByStatus(1); // only active
    }
}
