package org.stormsofts.matrimony.model;

import java.time.Instant;
import java.util.Map;

/** Inbound/outbound shape for /api/saved-searches/*. */
public class SavedSearchDTO {

    private Integer id;
    private String name;
    private Map<String, Object> filters;
    private Instant createdAt;

    public SavedSearchDTO() {
    }

    public SavedSearchDTO(Integer id, String name, Map<String, Object> filters, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.filters = filters;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Object> getFilters() {
        return filters;
    }

    public void setFilters(Map<String, Object> filters) {
        this.filters = filters;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}