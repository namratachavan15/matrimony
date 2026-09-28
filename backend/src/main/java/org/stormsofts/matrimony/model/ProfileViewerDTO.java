package org.stormsofts.matrimony.model;

public class ProfileViewerDTO {
    private Integer id;          // PVID
    private Integer userId;      // Viewer UID
    private String username;
    private String mobile;
    private String photo;

    public ProfileViewerDTO(Integer id, Integer userId, String username, String mobile, String photo) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.mobile = mobile;
        this.photo = photo;
    }

    // getters & setters
    public Integer getId() { return id; }
    public Integer getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getMobile() { return mobile; }
    public String getPhoto() { return photo; }

    public void setId(Integer id) { this.id = id; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public void setUsername(String username) { this.username = username; }
    public void setMobile(String mobile) { this.mobile = mobile; }
    public void setPhoto(String photo) { this.photo = photo; }
}
