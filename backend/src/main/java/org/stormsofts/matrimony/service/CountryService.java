package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstCountry;

import java.util.List;

public interface CountryService {

    public List<MstCountry> getAllCountries();
    public MstCountry createCountry(MstCountry country);
    public MstCountry updateCountry(Integer id, MstCountry countryDetails);
    public void deleteCountry(Integer id);
}
