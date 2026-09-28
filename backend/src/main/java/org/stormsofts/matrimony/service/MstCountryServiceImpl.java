package org.stormsofts.matrimony.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.matrimony.model.MstCountry;
import org.stormsofts.matrimony.repository.MstCountryRepository;

import java.util.List;

@Service
public class MstCountryServiceImpl  implements MstCountryService {

    @Autowired
    private MstCountryRepository countryRepository;



    public List<MstCountry> getAllCountries() {
        return countryRepository.findAll();
    }

    public List<MstCountry> getActiveCountries() {
        return countryRepository.findByStatus(1);
    }
}
