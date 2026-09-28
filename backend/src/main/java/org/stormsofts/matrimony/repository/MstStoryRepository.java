package org.stormsofts.matrimony.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.stormsofts.matrimony.model.MstStory;

import java.util.List;

@Repository
public interface MstStoryRepository extends JpaRepository<MstStory, Integer> {

    List<MstStory> findByBridenameContainingIgnoreCaseOrGroomnameContainingIgnoreCase(
            String bride, String groom
    );
}