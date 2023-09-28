package me.krft.frontend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Rating.
 */
@Table("rating")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Rating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("rate")
    private Double rate;

    @Column("comment")
    private String comment;

    @Transient
    @JsonIgnoreProperties(value = { "ratings", "showcases", "tags", "offer", "applicationUser" }, allowSetters = true)
    private ApplicationUserOffer applicationUserOffer;

    @Column("application_user_offer_id")
    private Long applicationUserOfferId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rating id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getRate() {
        return this.rate;
    }

    public Rating rate(Double rate) {
        this.setRate(rate);
        return this;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public String getComment() {
        return this.comment;
    }

    public Rating comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ApplicationUserOffer getApplicationUserOffer() {
        return this.applicationUserOffer;
    }

    public void setApplicationUserOffer(ApplicationUserOffer applicationUserOffer) {
        this.applicationUserOffer = applicationUserOffer;
        this.applicationUserOfferId = applicationUserOffer != null ? applicationUserOffer.getId() : null;
    }

    public Rating applicationUserOffer(ApplicationUserOffer applicationUserOffer) {
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
        if (!(o instanceof Rating)) {
            return false;
        }
        return id != null && id.equals(((Rating) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rating{" +
            "id=" + getId() +
            ", rate=" + getRate() +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
