package me.krft.frontend.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import me.krft.frontend.domain.Offer;
import me.krft.frontend.repository.OfferRepository;
import me.krft.frontend.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link me.krft.frontend.domain.Offer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OfferResource {

    private final Logger log = LoggerFactory.getLogger(OfferResource.class);

    private static final String ENTITY_NAME = "offer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OfferRepository offerRepository;

    public OfferResource(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    /**
     * {@code POST  /offers} : Create a new offer.
     *
     * @param offer the offer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offer, or with status {@code 400 (Bad Request)} if the offer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offers")
    public Mono<ResponseEntity<Offer>> createOffer(@Valid @RequestBody Offer offer) throws URISyntaxException {
        log.debug("REST request to save Offer : {}", offer);
        if (offer.getId() != null) {
            throw new BadRequestAlertException("A new offer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return offerRepository
            .save(offer)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/offers/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /offers/:id} : Updates an existing offer.
     *
     * @param id the id of the offer to save.
     * @param offer the offer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offer,
     * or with status {@code 400 (Bad Request)} if the offer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offers/{id}")
    public Mono<ResponseEntity<Offer>> updateOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Offer offer
    ) throws URISyntaxException {
        log.debug("REST request to update Offer : {}, {}", id, offer);
        if (offer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return offerRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return offerRepository
                    .save(offer)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /offers/:id} : Partial updates given fields of an existing offer, field will ignore if it is null
     *
     * @param id the id of the offer to save.
     * @param offer the offer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offer,
     * or with status {@code 400 (Bad Request)} if the offer is not valid,
     * or with status {@code 404 (Not Found)} if the offer is not found,
     * or with status {@code 500 (Internal Server Error)} if the offer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/offers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Offer>> partialUpdateOffer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Offer offer
    ) throws URISyntaxException {
        log.debug("REST request to partial update Offer partially : {}, {}", id, offer);
        if (offer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, offer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return offerRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Offer> result = offerRepository
                    .findById(offer.getId())
                    .map(existingOffer -> {
                        if (offer.getName() != null) {
                            existingOffer.setName(offer.getName());
                        }

                        return existingOffer;
                    })
                    .flatMap(offerRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /offers} : get all the offers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offers in body.
     */
    @GetMapping("/offers")
    public Mono<List<Offer>> getAllOffers() {
        log.debug("REST request to get all Offers");
        return offerRepository.findAll().collectList();
    }

    /**
     * {@code GET  /offers} : get all the offers as a stream.
     * @return the {@link Flux} of offers.
     */
    @GetMapping(value = "/offers", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Offer> getAllOffersAsStream() {
        log.debug("REST request to get all Offers as a stream");
        return offerRepository.findAll();
    }

    /**
     * {@code GET  /offers/:id} : get the "id" offer.
     *
     * @param id the id of the offer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offers/{id}")
    public Mono<ResponseEntity<Offer>> getOffer(@PathVariable Long id) {
        log.debug("REST request to get Offer : {}", id);
        Mono<Offer> offer = offerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(offer);
    }

    /**
     * {@code DELETE  /offers/:id} : delete the "id" offer.
     *
     * @param id the id of the offer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offers/{id}")
    public Mono<ResponseEntity<Void>> deleteOffer(@PathVariable Long id) {
        log.debug("REST request to delete Offer : {}", id);
        return offerRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
