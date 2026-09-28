package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstUser;

import java.util.List;
import java.util.Optional;

public interface MstUserService {

    public MstUser createUser(MstUser user);
    public MstUser updateUser(Integer id, MstUser updatedUser);
    public void deleteUser(Integer id);
    public List<MstUser> getAllUsers();
    public Optional<MstUser> getUserById(Integer id);
    public List<MstUser> searchUser(Integer id, String mobile);
    void changePassword(Integer userId, String oldPassword, String newPassword);
    MstUser incrementViewCount(Integer userId,Integer viewerId);
    public MstUser saveUser(MstUser user);
}


