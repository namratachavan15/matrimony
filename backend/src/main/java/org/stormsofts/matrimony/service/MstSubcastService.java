package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstSubcast;

import java.util.List;
import java.util.Optional;

public interface MstSubcastService {

    public MstSubcast addSubcast(MstSubcast subcast) ;
    public MstSubcast updateSubcast(Integer id, MstSubcast updated);
    public void deleteSubcast(Integer id);

    public Optional<MstSubcast> getById(Integer id);
    public List<MstSubcast> getAll();
    public List<MstSubcast> getAllActive();
    public List<MstSubcast> searchByName(String name);
}
