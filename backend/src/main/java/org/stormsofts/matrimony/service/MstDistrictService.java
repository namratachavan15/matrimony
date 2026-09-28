package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstDistrict;

import java.util.List;

public interface MstDistrictService {

    public List<MstDistrict> getAllActiveDistricts();

    public List<MstDistrict> getDistrictsByState(String stid);
}
