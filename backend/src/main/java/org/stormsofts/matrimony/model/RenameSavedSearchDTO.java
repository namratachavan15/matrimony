package org.stormsofts.matrimony.model;

/** Body for PUT /api/saved-searches/{id} (rename). */
public class RenameSavedSearchDTO {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}