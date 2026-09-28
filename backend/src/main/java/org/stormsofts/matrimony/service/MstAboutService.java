package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstAbout;

import java.util.List;

public interface MstAboutService {
    public List<MstAbout> getAllAbouts();
    public MstAbout saveAbout(MstAbout about);
    public void deleteAbout(Integer id);
}
