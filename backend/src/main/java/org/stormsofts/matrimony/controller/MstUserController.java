package org.stormsofts.matrimony.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.stormsofts.matrimony.model.ChangePasswordRequest;
import org.stormsofts.matrimony.model.MstUser;
import org.stormsofts.matrimony.model.OtpRequest;
import org.stormsofts.matrimony.repository.MstUserRepository;
import org.stormsofts.matrimony.service.MstUserService;
import org.stormsofts.matrimony.service.OtpService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/admin/user")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class MstUserController {

    @Autowired
    private  MstUserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private OtpService otpService;

    @Autowired
    private MstUserRepository userRepository;

    public MstUserController(MstUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<MstUser> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MstUser> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(
            @RequestPart("user") String userJson,
            @RequestPart(value = "uprofile", required = false) MultipartFile uprofileFile,
            @RequestPart(value = "aadharBackPhoto", required = false) MultipartFile aadharBackPhotoFile,
            @RequestPart(value = "aadharFrontPhoto", required = false) MultipartFile aadharFrontPhotoFile
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        MstUser user = mapper.readValue(userJson, MstUser.class);
        user.setStatus(1);

//        if (user.getDob() != null) {
//            user.setAge(Period.between(user.getDob(), LocalDate.now()).getYears());
//        } else {
//            user.setAge(null);
//        }

        // Directory paths
        String profileDir = "uploads/profile/";
        String aadhaarBackDir = "uploads/aadharBack/";
        String aadhaarFrontDir = "uploads/aadharFront/";

        // Profile photo
        if (uprofileFile != null && !uprofileFile.isEmpty()) {
            String profileFileName = System.currentTimeMillis() + "_" + uprofileFile.getOriginalFilename();
            Path path = Paths.get(profileDir + profileFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, uprofileFile.getBytes());
            user.setUprofile(profileFileName);
        }

        // Aadhaar Back
        if (aadharBackPhotoFile != null && !aadharBackPhotoFile.isEmpty()) {
            String backFileName = System.currentTimeMillis() + "_" + aadharBackPhotoFile.getOriginalFilename();
            Path path = Paths.get(aadhaarBackDir + backFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharBackPhotoFile.getBytes());
            user.setAadharBackPhoto(backFileName);
        }

        // Aadhaar Front
        if (aadharFrontPhotoFile != null && !aadharFrontPhotoFile.isEmpty()) {
            String frontFileName = System.currentTimeMillis() + "_" + aadharFrontPhotoFile.getOriginalFilename();
            Path path = Paths.get(aadhaarFrontDir + frontFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharFrontPhotoFile.getBytes());
            user.setAadharFrontPhoto(frontFileName);
        }

        // default for front photo if not provided
        if (user.getAadharFrontPhoto() == null) {
            user.setAadharFrontPhoto("");
        }



        userService.createUser(user);

        return ResponseEntity.ok(user);
    }


    @PutMapping("/{id}")
    public ResponseEntity<MstUser> updateUser(
            @PathVariable Integer id,
            @RequestPart("user") String userJson,
            @RequestPart(value = "uprofile", required = false) MultipartFile uprofileFile,
            @RequestPart(value = "aadharBackPhoto", required = false) MultipartFile aadharBackPhotoFile,
            @RequestPart(value = "aadharFrontPhoto", required = false) MultipartFile aadharFrontPhotoFile
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        MstUser updatedUser = mapper.readValue(userJson, MstUser.class);

        // existing user
        MstUser existing = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        updatedUser.setId(existing.getId());

        // 🔐 PASSWORD HANDLING
        if (updatedUser.getUpass() != null && !updatedUser.getUpass().trim().isEmpty()) {
            // admin entered a new password in frontend
            String encoded = passwordEncoder.encode(updatedUser.getUpass().trim());
            updatedUser.setUpass(encoded);
        } else {
            // no new password -> keep old one
            updatedUser.setUpass(existing.getUpass());
        }

        // 🔢 AGE FROM DOB
        // 🔢 AGE HANDLING: trust value coming from frontend
        if (updatedUser.getAge() == null) {
            // if frontend didn't send age, keep existing
            updatedUser.setAge(existing.getAge());
        }
// else: age already set from JSON, do not overwrite it


        // 🔁 file handling same as before...
        String profileDir = "uploads/profile/";
        String aadhaarBackDir = "uploads/aadharBack/";
        String aadhaarFrontDir = "uploads/aadharFront/";

        // Profile photo
        if (uprofileFile != null && !uprofileFile.isEmpty()) {
            String profileFileName = System.currentTimeMillis() + "_" + uprofileFile.getOriginalFilename();
            Path path = Paths.get(profileDir + profileFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, uprofileFile.getBytes());
            updatedUser.setUprofile(profileFileName);
        } else {
            updatedUser.setUprofile(existing.getUprofile());
        }

        // Aadhaar Back
        if (aadharBackPhotoFile != null && !aadharBackPhotoFile.isEmpty()) {
            String backFileName = System.currentTimeMillis() + "_" + aadharBackPhotoFile.getOriginalFilename();
            Path path = Paths.get(aadhaarBackDir + backFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharBackPhotoFile.getBytes());
            updatedUser.setAadharBackPhoto(backFileName);
        } else {
            updatedUser.setAadharBackPhoto(existing.getAadharBackPhoto());
        }

        // Aadhaar Front
        if (aadharFrontPhotoFile != null && !aadharFrontPhotoFile.isEmpty()) {
            String frontFileName = System.currentTimeMillis() + "_" + aadharFrontPhotoFile.getOriginalFilename();
            Path path = Paths.get(aadhaarFrontDir + frontFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharFrontPhotoFile.getBytes());
            updatedUser.setAadharFrontPhoto(frontFileName);
        } else {
            updatedUser.setAadharFrontPhoto(existing.getAadharFrontPhoto());
        }
        // ⭐⭐ IMPORTANT: keep old cLocation if frontend sends null/blank
        if (updatedUser.getCLocation() == null || updatedUser.getCLocation().trim().isEmpty()) {
            updatedUser.setCLocation(existing.getCLocation());
        }

        MstUser saved = userService.updateUser(id, updatedUser);
        // optional: saved.setUpass(null); // don't leak hash back
        return ResponseEntity.ok(saved);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/search")
    public List<MstUser> searchUser(@RequestParam(required = false) Integer id,
                                    @RequestParam(required = false) String mobile) {
        return userService.searchUser(id, mobile);
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            userService.changePassword(id, request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (RuntimeException ex) {
            // send 400 with message
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    // Increment profile view count by 50
    @PutMapping("/{id}/extend-viewcount")
    public ResponseEntity<MstUser> extendProfileViewCount(@PathVariable Integer id) {
        try {
            MstUser user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

            Integer currentCount = user.getProfileViewcount() == null ? 0 : user.getProfileViewcount();
            user.setProfileViewcount(currentCount + 50); // increment by 50

            MstUser saved = userService.updateUser(id, user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}/starcount")
    public ResponseEntity<MstUser> updateStarCount(
            @PathVariable Integer id,
            @RequestParam Integer starCount) {

        MstUser user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Limit star count between 0 and 5
        if (starCount < 0) starCount = 0;
        if (starCount > 5) starCount = 5;

        user.setStarcount(starCount);
        userService.saveUser(user);  // make sure saveUser() exists
        return ResponseEntity.ok(user);
    }


    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        if (!mobile.startsWith("+")) {
            mobile = "+91" + mobile; // prepend country code
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpService.saveOtp(mobile, otp);

        // Send SMS
        otpService.sendOtpSms(mobile, otp);

        System.out.println("OTP for " + mobile + " : " + otp); // debug

        return "OTP Sent";
    }


    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        if (!mobile.startsWith("+")) {
            mobile = "+91" + mobile;
        }

        String otp = request.get("otp");
        String storedOtp = otpService.getOtp(mobile);
        if (storedOtp == null) return "OTP expired or not found";
        if (!storedOtp.equals(otp)) return "Invalid OTP";

        otpService.removeOtp(mobile);

        String uname = request.get("uname");
        String email = request.get("email");
        String gender = request.get("gender");
        String dobStr = request.get("dob");
        String upass = request.get("upass");

        MstUser user = new MstUser();
        user.setUmobile(mobile);
        user.setUname(uname);
        user.setEmail(email);
        user.setGender(gender);
        user.setUpass(passwordEncoder.encode(upass));
        user.setStatus(1);
        user.setVstatus(1);
        user.setLogStatus(1);
user.setLogCount(0);
user.setViewcount(0);
user.setProfileViewcount(0);
user.setStarcount(0);
      //  user.setJdate(Instant.now()); // set current timestamp



// Set required fields with defaults
        user.setAltMobile(mobile);
        user.setWhatsappno(mobile);
        user.setAddress("Not Provided");
        user.setEducationDetails("Not Provided");
        user.setBirthplace("Unknown");
        user.setHeight("0");
        user.setWeight(0);
        user.setVarn("Unknown");
        user.setMarriageType("Unknown");
        user.setBloodgroup("Unknown");
        user.setInid("Unknown");
        user.setFincome("Unknown");
        user.setCurrentWork("Unknown");
        user.setCLocation("Unknown");
        user.setSpecs("Unknown");
        user.setDrink("No");
        user.setUrole("user");
        user.setDiet("No");
        user.setSmoking("No");
        user.setDieses("No");
        user.setDiseaseDetails("None");
        user.setExtendDate("");
        user.setUprofile("");
        user.setAadharFrontPhoto("");
        user.setAadharBackPhoto("");
        user.setAge(0);
        user.setCnid(0);
        user.setSctid(0);
        user.setDsid(0);
        user.setCstid(0);
        user.setSbeid(0);
        user.setEdid(0);
        user.setEducationDetails("");
        user.setCtid(0);;
        user.setStid(0);

        user.setDobTime(LocalTime.MIDNIGHT); // or LocalTime.of(0,0,0)

        user.setCdsid(0);
        user.setOtherinfo("");
        user.setExpectation("");
        user.setFamilydetails("");
        user.setRemark("");

        if (dobStr != null && !dobStr.isEmpty()) {
            try {
                user.setDob(LocalDate.parse(dobStr));
            } catch (Exception e) {
                System.out.println("Invalid DOB: " + dobStr);
            }
        }

        userRepository.save(user);


        if (dobStr != null && !dobStr.isEmpty()) {
            try {
                user.setDob(LocalDate.parse(dobStr));
            } catch (Exception e) {
                System.out.println("Invalid DOB: " + dobStr);
            }
        }

        userRepository.save(user);
        return "User Registered";
    }



}



