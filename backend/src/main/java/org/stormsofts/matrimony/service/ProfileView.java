package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.ProfileViewDTO;
import org.stormsofts.matrimony.model.ProfileViewerDTO;

import java.util.List;

public interface ProfileView {
    public List<ProfileViewDTO> getViewedProfiles(String search);
    public List<ProfileViewerDTO> getProfileViewers(Integer profileId);
}
