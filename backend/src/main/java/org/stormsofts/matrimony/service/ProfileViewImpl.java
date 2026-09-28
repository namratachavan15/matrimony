package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.ProfileViewDTO;
import org.stormsofts.matrimony.model.ProfileViewerDTO;
import org.stormsofts.matrimony.repository.MstProfileViewRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileViewImpl implements ProfileView
{
    @Autowired
 private MstProfileViewRepository repository;

    @Override
    public List<ProfileViewDTO> getViewedProfiles(String search) {
        List<Object[]> rows = repository.fetchViewedProfilesNative(search != null ? search : "");
        List<ProfileViewDTO> result = new ArrayList<>();

        for (Object[] row : rows) {
            Integer id = row[0] != null ? ((Number) row[0]).intValue() : null;
            Integer profileId = row[1] != null ? ((Number) row[1]).intValue() : null;
            String username = row[2] != null ? row[2].toString() : null;
            String mobile = row[3] != null ? row[3].toString() : null;

            result.add(new ProfileViewDTO(id, profileId, username, mobile));
        }

        return result;
    }

    public List<ProfileViewerDTO> getProfileViewers(Integer profileId) {
        List<Object[]> rows = repository.findViewersByProfileId(profileId);
        List<ProfileViewerDTO> viewers = new ArrayList<>();

        for (Object[] row : rows) {
            Integer pvid = row[0] != null ? ((Number) row[0]).intValue() : null;
            Integer userId = row[1] != null ? ((Number) row[1]).intValue() : null;
            String username = row[2] != null ? row[2].toString() : null;
            String mobile = row[3] != null ? row[3].toString() : null;
            String photo = row[4] != null ? row[4].toString() : null;

            viewers.add(new ProfileViewerDTO(pvid, userId, username, mobile, photo));
        }

        return viewers;
    }
}
