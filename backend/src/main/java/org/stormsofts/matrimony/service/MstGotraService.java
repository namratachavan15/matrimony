package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstGotra;

import java.util.List;

public interface MstGotraService {
    public List<MstGotra> getAll();
    public List<MstGotra> search(String keyword);
    public MstGotra getById(Integer id);
    public MstGotra create(MstGotra gotra);
    public MstGotra update(Integer id, MstGotra updated);
    public void delete(Integer id);
}
