package me.krft.frontend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A ApplicationUserOffer.
 */
@Table("application_user_offer")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUserOffer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("description")
    private String description;

    @Transient
    @JsonIgnoreProperties(value = { "applicationUserOffer" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "applicationUserOffer" }, allowSetters = true)
    private Set<Showcase> showcases = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "applicationUserOffer" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "machines" }, allowSetters = true)
    private Offer offer;

    @Transient
    @JsonIgnoreProperties(value = { "city" }, allowSetters = true)
    private ApplicationUser applicationUser;

    @Column("offer_id")
    private Long offerId;

    @Column("application_user_id")
    private Long applicationUserId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUserOffer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public ApplicationUserOffer description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setApplicationUserOffer(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setApplicationUserOffer(this));
        }
        this.ratings = ratings;
    }

    public ApplicationUserOffer ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public ApplicationUserOffer addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setApplicationUserOffer(this);
        return this;
    }

    public ApplicationUserOffer removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setApplicationUserOffer(null);
        return this;
    }

    public Set<Showcase> getShowcases() {
        return this.showcases;
    }

    public void setShowcases(Set<Showcase> showcases) {
        if (this.showcases != null) {
            this.showcases.forEach(i -> i.setApplicationUserOffer(null));
        }
        if (showcases != null) {
            showcases.forEach(i -> i.setApplicationUserOffer(this));
        }
        this.showcases = showcases;
    }

    public ApplicationUserOffer showcases(Set<Showcase> showcases) {
        this.setShowcases(showcases);
        return this;
    }

    public ApplicationUserOffer addShowcase(Showcase showcase) {
        this.showcases.add(showcase);
        showcase.setApplicationUserOffer(this);
        return this;
    }

    public ApplicationUserOffer removeShowcase(Showcase showcase) {
        this.showcases.remove(showcase);
        showcase.setApplicationUserOffer(null);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setApplicationUserOffer(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setApplicationUserOffer(this));
        }
        this.tags = tags;
    }

    public ApplicationUserOffer tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public ApplicationUserOffer addTag(Tag tag) {
        this.tags.add(tag);
        tag.setApplicationUserOffer(this);
        return this;
    }

    public ApplicationUserOffer removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.setApplicationUserOffer(null);
        return this;
    }

    public Offer getOffer() {
        return this.offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
        this.offerId = offer != null ? offer.getId() : null;
    }

    public ApplicationUserOffer offer(Offer offer) {
        this.setOffer(offer);
        return this;
    }

    public ApplicationUser getApplicationUser() {
        return this.applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
        this.applicationUserId = applicationUser != null ? applicationUser.getId() : null;
    }

    public ApplicationUserOffer applicationUser(ApplicationUser applicationUser) {
        this.setApplicationUser(applicationUser);
        return this;
    }

    public Long getOfferId() {
        return this.offerId;
    }

    public void setOfferId(Long offer) {
        this.offerId = offer;
    }

    public Long getApplicationUserId() {
        return this.applicationUserId;
    }

    public void setApplicationUserId(Long applicationUser) {
        this.applicationUserId = applicationUser;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUserOffer)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUserOffer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUserOffer{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
