package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstColor;

import java.util.List;

public interface MstColorService {

    public List<MstColor> getAllColors();
    public MstColor addColor(MstColor color);
}
