package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstMarriage;

import java.util.List;

public interface MarriageService {

    public List<MstMarriage> getAllMarriages();
    public MstMarriage getMarriageById(Integer id);
    public MstMarriage createMarriage(MstMarriage marriage);
    public MstMarriage updateMarriage(Integer id, MstMarriage updated);
    public void deleteMarriage(Integer id);
}
