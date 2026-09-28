package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstFamily;

import java.util.List;
import java.util.Optional;

public interface FamilyService {

    public List<MstFamily> getAllFamilies() ;
    public MstFamily getFamilyById(Integer id);
    public MstFamily createFamily(MstFamily family) ;
    public void deleteFamily(Integer id);
    public List<MstFamily> searchFamilies(String keyword) ;
    public MstFamily updateFamily(Integer id, MstFamily family) ;
    public Optional<MstFamily> getFamilyByUserId(Integer uid);
    }
