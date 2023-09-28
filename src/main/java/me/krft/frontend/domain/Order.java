package me.krft.frontend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.*;
import me.krft.frontend.domain.enumeration.State;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Order.
 */
@Table("jhi_order")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("date")
    private Instant date;

    @NotNull(message = "must not be null")
    @Column("state")
    private State state;

    @Transient
    @JsonIgnoreProperties(value = { "ratings", "showcases", "tags", "offer", "applicationUser" }, allowSetters = true)
    private ApplicationUserOffer provider;

    @Transient
    @JsonIgnoreProperties(value = { "city" }, allowSetters = true)
    private ApplicationUser client;

    @Column("provider_id")
    private Long providerId;

    @Column("client_id")
    private Long clientId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Order id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Order date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public State getState() {
        return this.state;
    }

    public Order state(State state) {
        this.setState(state);
        return this;
    }

    public void setState(State state) {
        this.state = state;
    }

    public ApplicationUserOffer getProvider() {
        return this.provider;
    }

    public void setProvider(ApplicationUserOffer applicationUserOffer) {
        this.provider = applicationUserOffer;
        this.providerId = applicationUserOffer != null ? applicationUserOffer.getId() : null;
    }

    public Order provider(ApplicationUserOffer applicationUserOffer) {
        this.setProvider(applicationUserOffer);
        return this;
    }

    public ApplicationUser getClient() {
        return this.client;
    }

    public void setClient(ApplicationUser applicationUser) {
        this.client = applicationUser;
        this.clientId = applicationUser != null ? applicationUser.getId() : null;
    }

    public Order client(ApplicationUser applicationUser) {
        this.setClient(applicationUser);
        return this;
    }

    public Long getProviderId() {
        return this.providerId;
    }

    public void setProviderId(Long applicationUserOffer) {
        this.providerId = applicationUserOffer;
    }

    public Long getClientId() {
        return this.clientId;
    }

    public void setClientId(Long applicationUser) {
        this.clientId = applicationUser;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", state='" + getState() + "'" +
            "}";
    }
}
