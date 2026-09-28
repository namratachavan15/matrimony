package org.stormsofts.matrimony.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String message;
    private MstUser user;
    private String token;

    public LoginResponse(String message, MstUser user) {
        this.message = message;
        this.user = user;
    }

    public LoginResponse(String message, MstUser user, String token) {
        this.message = message;
        this.user = user;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MstUser getUser() {
        return user;
    }

    public void setUser(MstUser user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
