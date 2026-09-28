package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstState;
import org.stormsofts.matrimony.repository.MstStateRepository;

import java.util.List;

@Service
public class MstStateServiceImpl implements MstStateService {

    @Autowired
    private MstStateRepository stateRepository;



    public List<MstState> getAllStates() {
        return stateRepository.findAll();
    }

    public List<MstState> getStatesByCountry(Integer cnid) {
        return stateRepository.findByCnid(cnid);
    }
}
