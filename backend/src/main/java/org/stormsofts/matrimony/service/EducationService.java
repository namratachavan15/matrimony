package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstEducation;

import java.util.List;

public interface EducationService {

    public List<MstEducation> getAll();
    public MstEducation getById(Integer id);
    public MstEducation create(MstEducation education);
    public MstEducation update(Integer id, MstEducation updated);
    public void delete(Integer id);
}
