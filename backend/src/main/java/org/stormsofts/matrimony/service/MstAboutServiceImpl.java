package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstAbout;
import org.stormsofts.matrimony.repository.MstAboutRepository;

import java.util.List;

@Service
public class MstAboutServiceImpl implements MstAboutService{

    @Autowired
    private MstAboutRepository repository;

    public List<MstAbout> getAllAbouts() {
        return repository.findAll();
    }

    public MstAbout saveAbout(MstAbout about) {
        return repository.save(about);
    }

    public void deleteAbout(Integer id) {
        repository.deleteById(id);
    }
}
