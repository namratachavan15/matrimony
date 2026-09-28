package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstCountry;
import org.stormsofts.matrimony.repository.CountryRepository;

import java.util.List;

@Service
public class CountryServiceImpl implements CountryService{

    @Autowired
    private CountryRepository countryRepository;



    public List<MstCountry> getAllCountries() {
        return countryRepository.findByStatus(1); // only active countries
    }

    public MstCountry createCountry(MstCountry country) {
        return countryRepository.save(country);
    }

    public MstCountry updateCountry(Integer id, MstCountry countryDetails) {
        MstCountry country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));
        country.setCountry(countryDetails.getCountry());
        country.setStatus(countryDetails.getStatus());
        return countryRepository.save(country);
    }

    public void deleteCountry(Integer id) {
        countryRepository.deleteById(id);
    }
}

