package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstBlood;
import org.stormsofts.matrimony.repository.MstBloodRepository;

import java.util.List;

@Service
public class MstBloodServiceImpl implements MstBloodService {

    @Autowired
    private  MstBloodRepository bloodRepository;

    @Override
    public List<MstBlood> getAllBloodGroups() {
        return bloodRepository.findAll();
    }

}