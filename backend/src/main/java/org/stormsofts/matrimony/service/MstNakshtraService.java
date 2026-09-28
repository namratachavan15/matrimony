package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstNakshtra;

import java.util.List;

public interface MstNakshtraService {

    public List<MstNakshtra> getAll();
    public List<MstNakshtra> search(String keyword);
    public MstNakshtra getById(Integer id);
    public MstNakshtra create(MstNakshtra nakshtra);
    public MstNakshtra update(Integer id, MstNakshtra updated);
    public void delete(Integer id);
}
