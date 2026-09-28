package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstGan;

import java.util.List;

public interface GanService {

    public MstGan createGan(MstGan gan);
    public List<MstGan> getAllGans();
    public MstGan updateGan(Integer id, MstGan ganDetails);
    public void deleteGan(Integer id);
}
