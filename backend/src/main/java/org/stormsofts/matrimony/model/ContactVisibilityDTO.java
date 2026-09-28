package org.stormsofts.matrimony.model;

/**
 * What a viewer is allowed to see of a profile owner's contact details.
 * Returned by GET /api/privacy/contact-visibility/{userId} -- deliberately
 * only these two booleans, never the owner's actual settings object, so a
 * viewer can't learn anything about the owner's privacy configuration
 * beyond "can I see their mobile/email".
 */
public class ContactVisibilityDTO {

    private boolean showMobile;
    private boolean showEmail;

    public ContactVisibilityDTO() {
    }

    public ContactVisibilityDTO(boolean showMobile, boolean showEmail) {
        this.showMobile = showMobile;
        this.showEmail = showEmail;
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