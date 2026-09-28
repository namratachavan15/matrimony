package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstRashi;
import org.stormsofts.matrimony.repository.RashiRepository;

import java.util.List;
import java.util.Optional;

public interface RashiService {


    public List<MstRashi> getAllRashis();
    public MstRashi createRashi(MstRashi rashi);
    public Optional<MstRashi> getRashiById(Integer id);
    public MstRashi updateRashi(Integer id, MstRashi rashi);
    public void deleteRashi(Integer id);


}
