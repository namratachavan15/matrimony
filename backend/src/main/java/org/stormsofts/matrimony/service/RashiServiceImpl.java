package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstRashi;
import org.stormsofts.matrimony.repository.RashiRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RashiServiceImpl implements RashiService {

    @Autowired
    private  RashiRepository rashiRepository;

    public List<MstRashi> getAllRashis() {
        return rashiRepository.findAll();
    }

    public MstRashi createRashi(MstRashi rashi) {
        return rashiRepository.save(rashi);
    }

    public Optional<MstRashi> getRashiById(Integer id) {
        return rashiRepository.findById(id);
    }

    public MstRashi updateRashi(Integer id, MstRashi rashi) {
        rashi.setId(id);
        return rashiRepository.save(rashi);
    }

    public void deleteRashi(Integer id) {
        rashiRepository.deleteById(id);
    }


}
