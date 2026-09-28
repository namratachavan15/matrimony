package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstState;

import java.util.List;

public interface MstStateService {

    public List<MstState> getAllStates();
    public List<MstState> getStatesByCountry(Integer cnid);

}
