package org.stormsofts.matrimony.service;

import org.stormsofts.matrimony.model.MstCountry;

import java.util.List;

public interface MstCountryService {

    public List<MstCountry> getAllCountries();
    public List<MstCountry> getActiveCountries();
}
