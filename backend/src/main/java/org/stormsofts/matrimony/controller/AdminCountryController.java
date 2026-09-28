//package org.stormsofts.matrimony.controller;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//import org.stormsofts.matrimony.model.MstCountry;
//import org.stormsofts.matrimony.service.CountryService;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/country")
//@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
//public class AdminCountryController {
//
//    @Autowired
//    private CountryService countryService;
//
//    @GetMapping
//    public List<MstCountry> getCountries() {
//        return countryService.getAllCountries();
//    }
//
//    @PostMapping
//    public MstCountry createCountry(@RequestBody MstCountry country) {
//        return countryService.createCountry(country);
//    }
//
//    @PutMapping("/{id}")
//    public MstCountry updateCountry(@PathVariable Integer id, @RequestBody MstCountry country) {
//        return countryService.updateCountry(id, country);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteCountry(@PathVariable Integer id) {
//        countryService.deleteCountry(id);
//    }
//}
