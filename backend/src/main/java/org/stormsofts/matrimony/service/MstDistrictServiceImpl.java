package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstDistrict;
import org.stormsofts.matrimony.repository.MstDistrictRepository;

import java.util.List;

@Service
public class MstDistrictServiceImpl implements MstDistrictService {

    @Autowired
    private MstDistrictRepository districtRepository;



    // get all active districts
    public List<MstDistrict> getAllActiveDistricts() {
        return districtRepository.findByStatus(1);
    }

    // get districts by state (STID)
    public List<MstDistrict> getDistrictsByState(String stid) {
        return districtRepository.findByStidAndStatus(stid, 1);
    }
}
