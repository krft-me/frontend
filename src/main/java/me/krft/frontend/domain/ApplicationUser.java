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
 * A ApplicationUser.
 */
@Table("application_user")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("first_name")
    private String firstName;

    @NotNull(message = "must not be null")
    @Column("last_name")
    private String lastName;

    @NotNull(message = "must not be null")
    @Column("pseudo")
    private String pseudo;

    @NotNull(message = "must not be null")
    @Column("average_rating")
    private Double averageRating;

    @Transient
    private User internalUser;

    @Transient
    @JsonIgnoreProperties(value = { "region" }, allowSetters = true)
    private City city;

    @Transient
    @JsonIgnoreProperties(
        value = { "internalUser", "city", "favoriteApplicationUsers", "favoriteOffers", "followers" },
        allowSetters = true
    )
    private Set<ApplicationUser> favoriteApplicationUsers = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "machines", "followers" }, allowSetters = true)
    private Set<Offer> favoriteOffers = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(
        value = { "internalUser", "city", "favoriteApplicationUsers", "favoriteOffers", "followers" },
        allowSetters = true
    )
    private Set<ApplicationUser> followers = new HashSet<>();

    @Column("internal_user_id")
    private String internalUserId;

    @Column("city_id")
    private Long cityId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public ApplicationUser firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public ApplicationUser lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPseudo() {
        return this.pseudo;
    }

    public ApplicationUser pseudo(String pseudo) {
        this.setPseudo(pseudo);
        return this;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public Double getAverageRating() {
        return this.averageRating;
    }

    public ApplicationUser averageRating(Double averageRating) {
        this.setAverageRating(averageRating);
        return this;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
        this.internalUserId = user != null ? user.getId() : null;
    }

    public ApplicationUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public City getCity() {
        return this.city;
    }

    public void setCity(City city) {
        this.city = city;
        this.cityId = city != null ? city.getId() : null;
    }

    public ApplicationUser city(City city) {
        this.setCity(city);
        return this;
    }

    public Set<ApplicationUser> getFavoriteApplicationUsers() {
        return this.favoriteApplicationUsers;
    }

    public void setFavoriteApplicationUsers(Set<ApplicationUser> applicationUsers) {
        this.favoriteApplicationUsers = applicationUsers;
    }

    public ApplicationUser favoriteApplicationUsers(Set<ApplicationUser> applicationUsers) {
        this.setFavoriteApplicationUsers(applicationUsers);
        return this;
    }

    public ApplicationUser addFavoriteApplicationUser(ApplicationUser applicationUser) {
        this.favoriteApplicationUsers.add(applicationUser);
        applicationUser.getFollowers().add(this);
        return this;
    }

    public ApplicationUser removeFavoriteApplicationUser(ApplicationUser applicationUser) {
        this.favoriteApplicationUsers.remove(applicationUser);
        applicationUser.getFollowers().remove(this);
        return this;
    }

    public Set<Offer> getFavoriteOffers() {
        return this.favoriteOffers;
    }

    public void setFavoriteOffers(Set<Offer> offers) {
        this.favoriteOffers = offers;
    }

    public ApplicationUser favoriteOffers(Set<Offer> offers) {
        this.setFavoriteOffers(offers);
        return this;
    }

    public ApplicationUser addFavoriteOffer(Offer offer) {
        this.favoriteOffers.add(offer);
        offer.getFollowers().add(this);
        return this;
    }

    public ApplicationUser removeFavoriteOffer(Offer offer) {
        this.favoriteOffers.remove(offer);
        offer.getFollowers().remove(this);
        return this;
    }

    public Set<ApplicationUser> getFollowers() {
        return this.followers;
    }

    public void setFollowers(Set<ApplicationUser> applicationUsers) {
        if (this.followers != null) {
            this.followers.forEach(i -> i.removeFavoriteApplicationUser(this));
        }
        if (applicationUsers != null) {
            applicationUsers.forEach(i -> i.addFavoriteApplicationUser(this));
        }
        this.followers = applicationUsers;
    }

    public ApplicationUser followers(Set<ApplicationUser> applicationUsers) {
        this.setFollowers(applicationUsers);
        return this;
    }

    public ApplicationUser addFollowers(ApplicationUser applicationUser) {
        this.followers.add(applicationUser);
        applicationUser.getFavoriteApplicationUsers().add(this);
        return this;
    }

    public ApplicationUser removeFollowers(ApplicationUser applicationUser) {
        this.followers.remove(applicationUser);
        applicationUser.getFavoriteApplicationUsers().remove(this);
        return this;
    }

    public String getInternalUserId() {
        return this.internalUserId;
    }

    public void setInternalUserId(String user) {
        this.internalUserId = user;
    }

    public Long getCityId() {
        return this.cityId;
    }

    public void setCityId(Long city) {
        this.cityId = city;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUser)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUser{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", pseudo='" + getPseudo() + "'" +
            ", averageRating=" + getAverageRating() +
            "}";
    }
}
