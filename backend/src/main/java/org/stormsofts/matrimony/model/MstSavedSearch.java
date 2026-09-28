package org.stormsofts.matrimony.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Part 12 (Saved Search). Stores a named snapshot of the existing Filter
 * modal's filter object (see frontend FilterContext.jsx) as JSON text rather
 * than one column per filter field, so it stays in sync automatically if
 * filter fields are ever added/renamed on the frontend -- no migration
 * needed here when that happens.
 */
@Getter
@Setter
@Entity
@Table(name = "mst_saved_search")
public class MstSavedSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "filters_json", nullable = false, columnDefinition = "TEXT")
    private String filtersJson;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFiltersJson() {
        return filtersJson;
    }

    public void setFiltersJson(String filtersJson) {
        this.filtersJson = filtersJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}