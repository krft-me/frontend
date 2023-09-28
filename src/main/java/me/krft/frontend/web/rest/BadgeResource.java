package me.krft.frontend.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import me.krft.frontend.domain.Badge;
import me.krft.frontend.repository.BadgeRepository;
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
 * REST controller for managing {@link me.krft.frontend.domain.Badge}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BadgeResource {

    private final Logger log = LoggerFactory.getLogger(BadgeResource.class);

    private static final String ENTITY_NAME = "badge";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BadgeRepository badgeRepository;

    public BadgeResource(BadgeRepository badgeRepository) {
        this.badgeRepository = badgeRepository;
    }

    /**
     * {@code POST  /badges} : Create a new badge.
     *
     * @param badge the badge to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new badge, or with status {@code 400 (Bad Request)} if the badge has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/badges")
    public Mono<ResponseEntity<Badge>> createBadge(@Valid @RequestBody Badge badge) throws URISyntaxException {
        log.debug("REST request to save Badge : {}", badge);
        if (badge.getId() != null) {
            throw new BadRequestAlertException("A new badge cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return badgeRepository
            .save(badge)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/badges/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /badges/:id} : Updates an existing badge.
     *
     * @param id the id of the badge to save.
     * @param badge the badge to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated badge,
     * or with status {@code 400 (Bad Request)} if the badge is not valid,
     * or with status {@code 500 (Internal Server Error)} if the badge couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/badges/{id}")
    public Mono<ResponseEntity<Badge>> updateBadge(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Badge badge
    ) throws URISyntaxException {
        log.debug("REST request to update Badge : {}, {}", id, badge);
        if (badge.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, badge.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return badgeRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return badgeRepository
                    .save(badge)
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
     * {@code PATCH  /badges/:id} : Partial updates given fields of an existing badge, field will ignore if it is null
     *
     * @param id the id of the badge to save.
     * @param badge the badge to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated badge,
     * or with status {@code 400 (Bad Request)} if the badge is not valid,
     * or with status {@code 404 (Not Found)} if the badge is not found,
     * or with status {@code 500 (Internal Server Error)} if the badge couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/badges/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Badge>> partialUpdateBadge(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Badge badge
    ) throws URISyntaxException {
        log.debug("REST request to partial update Badge partially : {}, {}", id, badge);
        if (badge.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, badge.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return badgeRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Badge> result = badgeRepository
                    .findById(badge.getId())
                    .map(existingBadge -> {
                        if (badge.getLabel() != null) {
                            existingBadge.setLabel(badge.getLabel());
                        }
                        if (badge.getPicture() != null) {
                            existingBadge.setPicture(badge.getPicture());
                        }
                        if (badge.getPictureContentType() != null) {
                            existingBadge.setPictureContentType(badge.getPictureContentType());
                        }

                        return existingBadge;
                    })
                    .flatMap(badgeRepository::save);

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
     * {@code GET  /badges} : get all the badges.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of badges in body.
     */
    @GetMapping("/badges")
    public Mono<List<Badge>> getAllBadges() {
        log.debug("REST request to get all Badges");
        return badgeRepository.findAll().collectList();
    }

    /**
     * {@code GET  /badges} : get all the badges as a stream.
     * @return the {@link Flux} of badges.
     */
    @GetMapping(value = "/badges", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Badge> getAllBadgesAsStream() {
        log.debug("REST request to get all Badges as a stream");
        return badgeRepository.findAll();
    }

    /**
     * {@code GET  /badges/:id} : get the "id" badge.
     *
     * @param id the id of the badge to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the badge, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/badges/{id}")
    public Mono<ResponseEntity<Badge>> getBadge(@PathVariable Long id) {
        log.debug("REST request to get Badge : {}", id);
        Mono<Badge> badge = badgeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(badge);
    }

    /**
     * {@code DELETE  /badges/:id} : delete the "id" badge.
     *
     * @param id the id of the badge to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/badges/{id}")
    public Mono<ResponseEntity<Void>> deleteBadge(@PathVariable Long id) {
        log.debug("REST request to delete Badge : {}", id);
        return badgeRepository
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
