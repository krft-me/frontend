package me.krft.frontend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Showcase.
 */
@Table("showcase")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Showcase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("image_id")
    private UUID imageId;

    @Transient
    @JsonIgnoreProperties(value = { "ratings", "showcases", "tags", "offer", "applicationUser" }, allowSetters = true)
    private ApplicationUserOffer applicationUserOffer;

    @Column("application_user_offer_id")
    private Long applicationUserOfferId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Showcase id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getImageId() {
        return this.imageId;
    }

    public Showcase imageId(UUID imageId) {
        this.setImageId(imageId);
        return this;
    }

    public void setImageId(UUID imageId) {
        this.imageId = imageId;
    }

    public ApplicationUserOffer getApplicationUserOffer() {
        return this.applicationUserOffer;
    }

    public void setApplicationUserOffer(ApplicationUserOffer applicationUserOffer) {
        this.applicationUserOffer = applicationUserOffer;
        this.applicationUserOfferId = applicationUserOffer != null ? applicationUserOffer.getId() : null;
    }

    public Showcase applicationUserOffer(ApplicationUserOffer applicationUserOffer) {
        this.setApplicationUserOffer(applicationUserOffer);
        return this;
    }

    public Long getApplicationUserOfferId() {
        return this.applicationUserOfferId;
    }

    public void setApplicationUserOfferId(Long applicationUserOffer) {
        this.applicationUserOfferId = applicationUserOffer;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Showcase)) {
            return false;
        }
        return id != null && id.equals(((Showcase) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Showcase{" +
            "id=" + getId() +
            ", imageId='" + getImageId() + "'" +
            "}";
    }
}
