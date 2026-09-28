package org.stormsofts.matrimony.model;

/** Body for GET/PUT /api/privacy/my. */
public class PrivacySettingsDTO {

    private ProfileVisibility profileVisibility;
    private boolean showMobile;
    private boolean showEmail;

    public PrivacySettingsDTO() {
    }

    public PrivacySettingsDTO(ProfileVisibility profileVisibility, boolean showMobile, boolean showEmail) {
        this.profileVisibility = profileVisibility;
        this.showMobile = showMobile;
        this.showEmail = showEmail;
    }

    public ProfileVisibility getProfileVisibility() {
        return profileVisibility;
    }

    public void setProfileVisibility(ProfileVisibility profileVisibility) {
        this.profileVisibility = profileVisibility;
    }

    public boolean isShowMobile() {
        return showMobile;
    }

    public void setShowMobile(boolean showMobile) {
        this.showMobile = showMobile;
    }

    public boolean isShowEmail() {
        return showEmail;
    }

    public void setShowEmail(boolean showEmail) {
        this.showEmail = showEmail;
    }
}