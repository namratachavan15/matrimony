package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstCast;

import java.util.List;

public interface CastService {
    MstCast saveCast(MstCast mstCast);
    List<MstCast> getAllCasts();
    List<MstCast> searchCasts(String keyword);

    MstCast updateCast(Integer id, MstCast mstCast);

    void deleteCast(Integer id);
}
