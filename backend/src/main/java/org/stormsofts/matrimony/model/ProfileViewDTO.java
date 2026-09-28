package org.stormsofts.matrimony.model;

import lombok.Data;


public class ProfileViewDTO {
    private Integer id;         // PVID
    private Integer profileId;  // PRID
    private String username;
    private String mobile;

    public ProfileViewDTO(Integer id, Integer profileId, String username, String mobile) {
        this.id = id;
        this.profileId = profileId;
        this.username = username;
        this.mobile = mobile;

    }

    // getters & setters
    public Integer getId() {
        return id;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public String getUsername() {
        return username;
    }

    public String getMobile() {
        return mobile;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

}
