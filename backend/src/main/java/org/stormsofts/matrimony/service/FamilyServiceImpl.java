package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstFamily;
import org.stormsofts.matrimony.repository.FamilyRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FamilyServiceImpl implements  FamilyService{

    @Autowired
    private FamilyRepository familyRepository;


    @Override
    public List<MstFamily> getAllFamilies() {
        return familyRepository.findAll();
    }

    public MstFamily getFamilyById(Integer id) {
        return familyRepository.findById(id).orElse(null);
    }

    public MstFamily createFamily(MstFamily family) {
        return familyRepository.save(family);
    }

    public MstFamily updateFamily(Integer id, MstFamily family) {
        MstFamily existing = familyRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setUid(family.getUid());
            existing.setFather(family.getFather());
            existing.setMother(family.getMother());
            existing.setBrother(family.getBrother());
            existing.setSister(family.getSister());
            existing.setFatherOccupation(family.getFatherOccupation());
            existing.setMotherOccupation(family.getMotherOccupation());
            existing.setBrotherOccupation(family.getBrotherOccupation());
            existing.setPropertyDetails(family.getPropertyDetails());
            existing.setOtherDetails(family.getOtherDetails());
            return familyRepository.save(existing);
        }
        return null;
    }

    public void deleteFamily(Integer id) {
        familyRepository.deleteById(id);
    }

public List<MstFamily> searchFamilies(String keyword) {
        Integer uid = Integer.parseInt(keyword); // only allow numeric

        return familyRepository.findByUid(uid);
    }

    public Optional<MstFamily> getFamilyByUserId(Integer uid) {
        List<MstFamily> families = familyRepository.findByUid(uid);

        // Log all families to console
        if (families.isEmpty()) {
            System.out.println("No families found for uid: " + uid);
        } else {
            System.out.println("Families found for uid " + uid + ":");
            families.forEach(f -> System.out.println(f));
        }

        // Return first if exists
        return families.stream().findFirst();
    }



}
