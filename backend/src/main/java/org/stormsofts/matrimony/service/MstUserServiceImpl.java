package org.stormsofts.matrimony.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstProfileView;
import org.stormsofts.matrimony.model.MstUser;
import org.stormsofts.matrimony.model.NotificationType;
import org.stormsofts.matrimony.model.ProfileCardDTO;
import org.stormsofts.matrimony.repository.MstProfileViewRepository;
import org.stormsofts.matrimony.repository.MstUserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MstUserServiceImpl implements MstUserService {

    @Autowired
    private  MstUserRepository userRepository;

    @Autowired
    private MstProfileViewRepository    profileViewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;

    public MstUser createUser(MstUser user) {
        if (user.getSbeid() == null) user.setSbeid(0);


        // 🔐 encode password on create
        if (user.getUpass() != null && !user.getUpass().isBlank()) {
            user.setUpass(passwordEncoder.encode(user.getUpass()));
        }
        return userRepository.save(user);
    }
    @Override
    public MstUser saveUser(MstUser user) {
        return userRepository.save(user);
    }

    public MstUser updateUser(Integer id, MstUser updatedUser) {
        Optional<MstUser> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            updatedUser.setId(id);
            updatedUser.setStatus(1);
            return userRepository.save(updatedUser);
        }
        throw new RuntimeException("User not found with id: " + id);
    }


    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public List<MstUser> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<MstUser> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // Search by ID or Mobile
    public List<MstUser> searchUser(Integer id, String mobile) {
        if ((id == null || id == 0) && (mobile == null || mobile.isEmpty())) {
            return getAllUsers();
        }
        return userRepository.findByIdOrUmobile(id, mobile);
    }

    @Override
    public void changePassword(Integer userId, String oldPassword, String newPassword) {
        MstUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // ✅ check old password
        if (!passwordEncoder.matches(oldPassword, user.getUpass())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        // ✅ encode and set new password
        user.setUpass(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public MstUser incrementViewCount(Integer profileId, Integer viewerId) {
        MstUser profile = userRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Increment view count
        profile.setViewcount((profile.getViewcount() == null ? 0 : profile.getViewcount()) + 1);
        userRepository.save(profile);

        // Save a record in mst_profile_view
        MstProfileView view = new MstProfileView();
        view.setUid(viewerId);   // user who clicked
        view.setPrid(profileId); // profile being viewed
        view.setStatus(1);       // always 1 when profile is viewed
        profileViewRepository.save(view);

        // Notify the profile owner that someone viewed their profile
        // (skip self-views -- viewing your own profile isn't notification-worthy).
        if (viewerId != null && !viewerId.equals(profileId)) {
            ProfileCardDTO viewer = userRepository.findProfileCardById(viewerId).orElse(null);
            String viewerName = viewer != null ? viewer.getUname() : "Someone";
            notificationService.notify(
                    profileId,
                    NotificationType.PROFILE_VIEWED,
                    "Profile Viewed",
                    viewerName + " viewed your profile.",
                    viewerId,
                    null
            );
        }

        return profile;
    }



}
