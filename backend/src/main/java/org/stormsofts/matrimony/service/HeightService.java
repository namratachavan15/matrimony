package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstHeight;

import java.util.List;

public interface HeightService {

    public List<MstHeight> getAllHeights();
    public MstHeight getHeightById(Integer id);
    public MstHeight createHeight(MstHeight height);
    public MstHeight updateHeight(Integer id, MstHeight updated);
    public void deleteHeight(Integer id);
}
