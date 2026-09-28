package org.stormsofts.matrimony.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.stormsofts.matrimony.model.LoginRequest;
import org.stormsofts.matrimony.model.LoginResponse;
import org.stormsofts.matrimony.model.MstUser;
import org.stormsofts.matrimony.model.RegisterRequest;
import org.stormsofts.matrimony.repository.MstUserRepository;
import org.stormsofts.matrimony.security.JwtService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.LocalTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")


public class AuthController {

    @Autowired
    private  MstUserRepository mstUserRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;


    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> register(
            @RequestPart("user") String userJson,
            @RequestPart(value = "uprofile", required = false) MultipartFile uprofile,
            @RequestPart(value = "aadharFrontPhoto", required = false) MultipartFile aadharFrontPhoto,
            @RequestPart(value = "aadharBackPhoto", required = false) MultipartFile aadharBackPhoto
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        RegisterRequest req = mapper.readValue(userJson, RegisterRequest.class);

        if (req.getUmobile() == null || req.getUmobile().trim().isEmpty()
                || req.getUpass() == null || req.getUpass().trim().isEmpty()
                || req.getUname() == null || req.getUname().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name, mobile and password are required.");
        }

        if (mstUserRepository.findByUmobileAndUrole(req.getUmobile().trim(),
                req.getUrole() != null ? req.getUrole() : "user").isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Mobile already registered.");
        }

        MstUser user = new MstUser();
        user.setUname(req.getUname().trim());
        user.setUmobile(req.getUmobile().trim());
        user.setGender(req.getGender() != null ? req.getGender() : "other");
        user.setUpass(passwordEncoder.encode(req.getUpass().trim()));
        user.setUrole(req.getUrole() != null ? req.getUrole() : "user");

        // defaults
        user.setAltMobile(user.getUmobile());
        user.setWhatsappno(user.getUmobile());
        user.setEmail("");
        user.setAddress("");
        user.setEducationDetails("");
        user.setRemark("");
        user.setOtherinfo("");
        user.setBirthplace("");
        user.setHeight("");
        user.setWeight(0);
        user.setVarn("");
        user.setMarriageType("");
        user.setBloodgroup("");
        user.setInid("");
        user.setFincome("");
        user.setCurrentWork("");
        user.setCLocation("");
        user.setSpecs("");
        user.setDrink("");
        user.setDiet("");
        user.setSmoking("");
        user.setDieses("");
        user.setDiseaseDetails("");
        user.setExpectation("");
        user.setFamilydetails("");
        user.setDobTime(LocalTime.of(0,0));
        user.setDsid(0);
        user.setEdid(0);
        user.setStid(0);
        user.setAge(0);
        user.setSctid(0);

 user.setCnid(0);
 user.setCtid(0);
 user.setSbeid(0);
        user.setExtendDate("N/A");

        // status for short registration
        user.setStatus(0); // inactive until admin approves

        // file uploads
        String profileDir = "uploads/profile/";
        String aadhaarBackDir = "uploads/aadharBack/";
        String aadhaarFrontDir = "uploads/aadharFront/";

        if (uprofile != null && !uprofile.isEmpty()) {
            String profileFileName = System.currentTimeMillis() + "_" + uprofile.getOriginalFilename();
            Path path = Paths.get(profileDir + profileFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, uprofile.getBytes());
            user.setUprofile(profileFileName);
        }

        if (aadharBackPhoto != null && !aadharBackPhoto.isEmpty()) {
            String backFileName = System.currentTimeMillis() + "_" + aadharBackPhoto.getOriginalFilename();
            Path path = Paths.get(aadhaarBackDir + backFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharBackPhoto.getBytes());
            user.setAadharBackPhoto(backFileName);
        }

        if (aadharFrontPhoto != null && !aadharFrontPhoto.isEmpty()) {
            String frontFileName = System.currentTimeMillis() + "_" + aadharFrontPhoto.getOriginalFilename();
            Path path = Paths.get(aadhaarFrontDir + frontFileName);
            Files.createDirectories(path.getParent());
            Files.write(path, aadharFrontPhoto.getBytes());
            user.setAadharFrontPhoto(frontFileName);
        }

        if (user.getAadharFrontPhoto() == null) {
            user.setAadharFrontPhoto("");
        }

        MstUser saved = mstUserRepository.save(user);
        saved.setUpass(null); // hide password
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        String mobile = request.getUmobile() != null ? request.getUmobile().trim() : "";
        String password = request.getUpass() != null ? request.getUpass().trim() : "";

        // role passed from frontend
        String role = request.getUrole() != null ? request.getUrole().trim() : "user";

        if (mobile.isEmpty() || password.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Mobile number and password are required.");
        }

        Optional<MstUser> optionalUser =
                mstUserRepository.findByUmobileAndUrole(mobile, role);

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid mobile or role.");
        }

        MstUser user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getUpass())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password.");
        }

        // update login info
        user.setLogCount(user.getLogCount() + 1);
      //  user.setJdate(Instant.now());
        user.setLogStatus(1);
        mstUserRepository.save(user);

        user.setUpass(null);

        String token = jwtService.generateToken(user.getId(), user.getUrole(), user.getUname());

        LoginResponse response = new LoginResponse("Login successful", user, token);

        return ResponseEntity.ok(response);
    }

}
