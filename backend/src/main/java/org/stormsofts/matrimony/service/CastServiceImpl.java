package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.exception.CastAlreadyExistsException;
import org.stormsofts.matrimony.model.MstCast;
import org.stormsofts.matrimony.repository.CastRepo;

import java.util.List;
import java.util.Optional;

@Service
public class CastServiceImpl implements CastService{

    @Autowired
    public CastRepo castRepo;

    @Override
    public MstCast saveCast(MstCast mstCast) {

        if (mstCast == null) {
            throw new IllegalArgumentException("Cast details cannot be null");
        }

        // 2) Duplicate check by name (recommended)
        if (mstCast.getCast() != null && !mstCast.getCast().trim().isEmpty()) {

            Optional<MstCast> existingByName = castRepo.findByCast(mstCast.getCast().trim());

            if (existingByName.isPresent()) {
                throw new CastAlreadyExistsException("Cast already exists with name: " + mstCast.getCast());
            }

        }

        // 3) Optional: duplicate check by id if id is set
        if (mstCast.getId() != null) {

            Optional<MstCast> existingById = castRepo.findById(mstCast.getId());
            if (existingById.isPresent()) {
                throw new CastAlreadyExistsException("Cast already exists with id: " + mstCast.getId());
            }

        }
        // 4) Save and return
        return castRepo.save(mstCast);
    }

    @Override
    public List<MstCast> getAllCasts() {
        return castRepo.findAll();
    }

    @Override
    public List<MstCast> searchCasts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return castRepo.findAll();
        }
        return castRepo.findByCastContainingIgnoreCase(keyword.trim());
    }

    // ✅ UPDATE
    @Override
    public MstCast updateCast(Integer id, MstCast mstCast) {
        MstCast existing = castRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cast not found with id: " + id));

        // duplicate check by name (if changed)
        if (mstCast.getCast() != null && !mstCast.getCast().trim().isEmpty()) {
            Optional<MstCast> existingByName = castRepo.findByCast(mstCast.getCast().trim());
            if (existingByName.isPresent() && !existingByName.get().getId().equals(id)) {
                throw new CastAlreadyExistsException("Cast already exists with name: " + mstCast.getCast());
            }
            existing.setCast(mstCast.getCast().trim());
        }

        // update status if you want
        if (mstCast.getStatus() != null) {
            existing.setStatus(mstCast.getStatus());
        }

        return castRepo.save(existing);
    }

    // ✅ DELETE
    @Override
    public void deleteCast(Integer id) {
        if (!castRepo.existsById(id)) {
            throw new RuntimeException("Cast not found with id: " + id);
        }
        castRepo.deleteById(id);
    }
}



