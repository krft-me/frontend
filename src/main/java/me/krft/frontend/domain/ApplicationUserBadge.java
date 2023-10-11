package me.krft.frontend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A ApplicationUserBadge.
 */
@Table("application_user_badge")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUserBadge implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("obtention_date")
    private Instant obtentionDate;

    @Transient
    @JsonIgnoreProperties(
        value = { "internalUser", "city", "favoriteApplicationUsers", "favoriteOffers", "followers" },
        allowSetters = true
    )
    private ApplicationUser applicationUser;

    @Transient
    private Badge badge;

    @Column("application_user_id")
    private Long applicationUserId;

    @Column("badge_id")
    private Long badgeId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUserBadge id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getObtentionDate() {
        return this.obtentionDate;
    }

    public ApplicationUserBadge obtentionDate(Instant obtentionDate) {
        this.setObtentionDate(obtentionDate);
        return this;
    }

    public void setObtentionDate(Instant obtentionDate) {
        this.obtentionDate = obtentionDate;
    }

    public ApplicationUser getApplicationUser() {
        return this.applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
        this.applicationUserId = applicationUser != null ? applicationUser.getId() : null;
    }

    public ApplicationUserBadge applicationUser(ApplicationUser applicationUser) {
        this.setApplicationUser(applicationUser);
        return this;
    }

    public Badge getBadge() {
        return this.badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
        this.badgeId = badge != null ? badge.getId() : null;
    }

    public ApplicationUserBadge badge(Badge badge) {
        this.setBadge(badge);
        return this;
    }

    public Long getApplicationUserId() {
        return this.applicationUserId;
    }

    public void setApplicationUserId(Long applicationUser) {
        this.applicationUserId = applicationUser;
    }

    public Long getBadgeId() {
        return this.badgeId;
    }

    public void setBadgeId(Long badge) {
        this.badgeId = badge;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUserBadge)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUserBadge) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUserBadge{" +
            "id=" + getId() +
            ", obtentionDate='" + getObtentionDate() + "'" +
            "}";
    }
}
