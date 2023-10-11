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
 * A Offer.
 */
@Table("offer")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Offer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("name")
    private String name;

    @Transient
    @JsonIgnoreProperties(value = { "categories", "offer" }, allowSetters = true)
    private Set<Machine> machines = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(
        value = { "internalUser", "city", "favoriteApplicationUsers", "favoriteOffers", "followers" },
        allowSetters = true
    )
    private Set<ApplicationUser> followers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Offer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Offer name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Machine> getMachines() {
        return this.machines;
    }

    public void setMachines(Set<Machine> machines) {
        if (this.machines != null) {
            this.machines.forEach(i -> i.setOffer(null));
        }
        if (machines != null) {
            machines.forEach(i -> i.setOffer(this));
        }
        this.machines = machines;
    }

    public Offer machines(Set<Machine> machines) {
        this.setMachines(machines);
        return this;
    }

    public Offer addMachine(Machine machine) {
        this.machines.add(machine);
        machine.setOffer(this);
        return this;
    }

    public Offer removeMachine(Machine machine) {
        this.machines.remove(machine);
        machine.setOffer(null);
        return this;
    }

    public Set<ApplicationUser> getFollowers() {
        return this.followers;
    }

    public void setFollowers(Set<ApplicationUser> applicationUsers) {
        if (this.followers != null) {
            this.followers.forEach(i -> i.removeFavoriteOffer(this));
        }
        if (applicationUsers != null) {
            applicationUsers.forEach(i -> i.addFavoriteOffer(this));
        }
        this.followers = applicationUsers;
    }

    public Offer followers(Set<ApplicationUser> applicationUsers) {
        this.setFollowers(applicationUsers);
        return this;
    }

    public Offer addFollowers(ApplicationUser applicationUser) {
        this.followers.add(applicationUser);
        applicationUser.getFavoriteOffers().add(this);
        return this;
    }

    public Offer removeFollowers(ApplicationUser applicationUser) {
        this.followers.remove(applicationUser);
        applicationUser.getFavoriteOffers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Offer)) {
            return false;
        }
        return id != null && id.equals(((Offer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Offer{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
