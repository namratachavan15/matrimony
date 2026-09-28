package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstNadi;

import java.util.List;

public interface MstNadiService {
    public List<MstNadi> getAll() ;
    public List<MstNadi> search(String keyword);
    public MstNadi getById(Integer id);
    public MstNadi create(MstNadi nadi);
    public MstNadi update(Integer id, MstNadi updated);
    public void delete(Integer id);
}
