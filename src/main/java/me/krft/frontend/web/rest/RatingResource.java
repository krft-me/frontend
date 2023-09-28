package me.krft.frontend.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import me.krft.frontend.domain.Rating;
import me.krft.frontend.repository.RatingRepository;
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
 * REST controller for managing {@link me.krft.frontend.domain.Rating}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RatingResource {

    private final Logger log = LoggerFactory.getLogger(RatingResource.class);

    private static final String ENTITY_NAME = "rating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RatingRepository ratingRepository;

    public RatingResource(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    /**
     * {@code POST  /ratings} : Create a new rating.
     *
     * @param rating the rating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rating, or with status {@code 400 (Bad Request)} if the rating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ratings")
    public Mono<ResponseEntity<Rating>> createRating(@Valid @RequestBody Rating rating) throws URISyntaxException {
        log.debug("REST request to save Rating : {}", rating);
        if (rating.getId() != null) {
            throw new BadRequestAlertException("A new rating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return ratingRepository
            .save(rating)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/ratings/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /ratings/:id} : Updates an existing rating.
     *
     * @param id the id of the rating to save.
     * @param rating the rating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rating,
     * or with status {@code 400 (Bad Request)} if the rating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ratings/{id}")
    public Mono<ResponseEntity<Rating>> updateRating(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Rating rating
    ) throws URISyntaxException {
        log.debug("REST request to update Rating : {}, {}", id, rating);
        if (rating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return ratingRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return ratingRepository
                    .save(rating)
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
     * {@code PATCH  /ratings/:id} : Partial updates given fields of an existing rating, field will ignore if it is null
     *
     * @param id the id of the rating to save.
     * @param rating the rating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rating,
     * or with status {@code 400 (Bad Request)} if the rating is not valid,
     * or with status {@code 404 (Not Found)} if the rating is not found,
     * or with status {@code 500 (Internal Server Error)} if the rating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ratings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Rating>> partialUpdateRating(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Rating rating
    ) throws URISyntaxException {
        log.debug("REST request to partial update Rating partially : {}, {}", id, rating);
        if (rating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return ratingRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Rating> result = ratingRepository
                    .findById(rating.getId())
                    .map(existingRating -> {
                        if (rating.getRate() != null) {
                            existingRating.setRate(rating.getRate());
                        }
                        if (rating.getComment() != null) {
                            existingRating.setComment(rating.getComment());
                        }

                        return existingRating;
                    })
                    .flatMap(ratingRepository::save);

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
     * {@code GET  /ratings} : get all the ratings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ratings in body.
     */
    @GetMapping("/ratings")
    public Mono<List<Rating>> getAllRatings() {
        log.debug("REST request to get all Ratings");
        return ratingRepository.findAll().collectList();
    }

    /**
     * {@code GET  /ratings} : get all the ratings as a stream.
     * @return the {@link Flux} of ratings.
     */
    @GetMapping(value = "/ratings", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Rating> getAllRatingsAsStream() {
        log.debug("REST request to get all Ratings as a stream");
        return ratingRepository.findAll();
    }

    /**
     * {@code GET  /ratings/:id} : get the "id" rating.
     *
     * @param id the id of the rating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ratings/{id}")
    public Mono<ResponseEntity<Rating>> getRating(@PathVariable Long id) {
        log.debug("REST request to get Rating : {}", id);
        Mono<Rating> rating = ratingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rating);
    }

    /**
     * {@code DELETE  /ratings/:id} : delete the "id" rating.
     *
     * @param id the id of the rating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ratings/{id}")
    public Mono<ResponseEntity<Void>> deleteRating(@PathVariable Long id) {
        log.debug("REST request to delete Rating : {}", id);
        return ratingRepository
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
