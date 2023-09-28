package me.krft.frontend.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import me.krft.frontend.domain.Showcase;
import me.krft.frontend.repository.ShowcaseRepository;
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
 * REST controller for managing {@link me.krft.frontend.domain.Showcase}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShowcaseResource {

    private final Logger log = LoggerFactory.getLogger(ShowcaseResource.class);

    private static final String ENTITY_NAME = "showcase";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShowcaseRepository showcaseRepository;

    public ShowcaseResource(ShowcaseRepository showcaseRepository) {
        this.showcaseRepository = showcaseRepository;
    }

    /**
     * {@code POST  /showcases} : Create a new showcase.
     *
     * @param showcase the showcase to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new showcase, or with status {@code 400 (Bad Request)} if the showcase has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/showcases")
    public Mono<ResponseEntity<Showcase>> createShowcase(@Valid @RequestBody Showcase showcase) throws URISyntaxException {
        log.debug("REST request to save Showcase : {}", showcase);
        if (showcase.getId() != null) {
            throw new BadRequestAlertException("A new showcase cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return showcaseRepository
            .save(showcase)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/showcases/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /showcases/:id} : Updates an existing showcase.
     *
     * @param id the id of the showcase to save.
     * @param showcase the showcase to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated showcase,
     * or with status {@code 400 (Bad Request)} if the showcase is not valid,
     * or with status {@code 500 (Internal Server Error)} if the showcase couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/showcases/{id}")
    public Mono<ResponseEntity<Showcase>> updateShowcase(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Showcase showcase
    ) throws URISyntaxException {
        log.debug("REST request to update Showcase : {}, {}", id, showcase);
        if (showcase.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, showcase.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return showcaseRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return showcaseRepository
                    .save(showcase)
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
     * {@code PATCH  /showcases/:id} : Partial updates given fields of an existing showcase, field will ignore if it is null
     *
     * @param id the id of the showcase to save.
     * @param showcase the showcase to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated showcase,
     * or with status {@code 400 (Bad Request)} if the showcase is not valid,
     * or with status {@code 404 (Not Found)} if the showcase is not found,
     * or with status {@code 500 (Internal Server Error)} if the showcase couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/showcases/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Showcase>> partialUpdateShowcase(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Showcase showcase
    ) throws URISyntaxException {
        log.debug("REST request to partial update Showcase partially : {}, {}", id, showcase);
        if (showcase.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, showcase.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return showcaseRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Showcase> result = showcaseRepository
                    .findById(showcase.getId())
                    .map(existingShowcase -> {
                        if (showcase.getImageId() != null) {
                            existingShowcase.setImageId(showcase.getImageId());
                        }

                        return existingShowcase;
                    })
                    .flatMap(showcaseRepository::save);

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
     * {@code GET  /showcases} : get all the showcases.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of showcases in body.
     */
    @GetMapping("/showcases")
    public Mono<List<Showcase>> getAllShowcases() {
        log.debug("REST request to get all Showcases");
        return showcaseRepository.findAll().collectList();
    }

    /**
     * {@code GET  /showcases} : get all the showcases as a stream.
     * @return the {@link Flux} of showcases.
     */
    @GetMapping(value = "/showcases", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Showcase> getAllShowcasesAsStream() {
        log.debug("REST request to get all Showcases as a stream");
        return showcaseRepository.findAll();
    }

    /**
     * {@code GET  /showcases/:id} : get the "id" showcase.
     *
     * @param id the id of the showcase to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the showcase, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/showcases/{id}")
    public Mono<ResponseEntity<Showcase>> getShowcase(@PathVariable Long id) {
        log.debug("REST request to get Showcase : {}", id);
        Mono<Showcase> showcase = showcaseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(showcase);
    }

    /**
     * {@code DELETE  /showcases/:id} : delete the "id" showcase.
     *
     * @param id the id of the showcase to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/showcases/{id}")
    public Mono<ResponseEntity<Void>> deleteShowcase(@PathVariable Long id) {
        log.debug("REST request to delete Showcase : {}", id);
        return showcaseRepository
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
