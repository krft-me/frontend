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
 * A Machine.
 */
@Table("machine")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Machine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("name")
    private String name;

    @Transient
    @JsonIgnoreProperties(value = { "machine" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @Transient
    @JsonIgnoreProperties(value = { "machines" }, allowSetters = true)
    private Offer offer;

    @Column("offer_id")
    private Long offerId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Machine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Machine name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        if (this.categories != null) {
            this.categories.forEach(i -> i.setMachine(null));
        }
        if (categories != null) {
            categories.forEach(i -> i.setMachine(this));
        }
        this.categories = categories;
    }

    public Machine categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Machine addCategory(Category category) {
        this.categories.add(category);
        category.setMachine(this);
        return this;
    }

    public Machine removeCategory(Category category) {
        this.categories.remove(category);
        category.setMachine(null);
        return this;
    }

    public Offer getOffer() {
        return this.offer;
    }

    public void setOffer(Offer offer) {
        this.offer = offer;
        this.offerId = offer != null ? offer.getId() : null;
    }

    public Machine offer(Offer offer) {
        this.setOffer(offer);
        return this;
    }

    public Long getOfferId() {
        return this.offerId;
    }

    public void setOfferId(Long offer) {
        this.offerId = offer;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Machine)) {
            return false;
        }
        return id != null && id.equals(((Machine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Machine{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
