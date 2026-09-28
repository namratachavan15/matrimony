package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstOtherinfo;

import java.util.List;
import java.util.Optional;

public interface OtherinfoService {

    public MstOtherinfo save(MstOtherinfo otherinfo);
    public MstOtherinfo update(Integer id, MstOtherinfo otherinfo);
    public void delete(Integer id);
    public List<MstOtherinfo> getAll();
    public List<MstOtherinfo> search(String keyword);
    public Optional<MstOtherinfo> getOtherInfoByUserId(Integer uid);
}
