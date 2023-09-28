package me.krft.frontend.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import me.krft.frontend.domain.Machine;
import me.krft.frontend.repository.MachineRepository;
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
 * REST controller for managing {@link me.krft.frontend.domain.Machine}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MachineResource {

    private final Logger log = LoggerFactory.getLogger(MachineResource.class);

    private static final String ENTITY_NAME = "machine";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MachineRepository machineRepository;

    public MachineResource(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    /**
     * {@code POST  /machines} : Create a new machine.
     *
     * @param machine the machine to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new machine, or with status {@code 400 (Bad Request)} if the machine has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/machines")
    public Mono<ResponseEntity<Machine>> createMachine(@Valid @RequestBody Machine machine) throws URISyntaxException {
        log.debug("REST request to save Machine : {}", machine);
        if (machine.getId() != null) {
            throw new BadRequestAlertException("A new machine cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return machineRepository
            .save(machine)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/machines/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /machines/:id} : Updates an existing machine.
     *
     * @param id the id of the machine to save.
     * @param machine the machine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated machine,
     * or with status {@code 400 (Bad Request)} if the machine is not valid,
     * or with status {@code 500 (Internal Server Error)} if the machine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/machines/{id}")
    public Mono<ResponseEntity<Machine>> updateMachine(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Machine machine
    ) throws URISyntaxException {
        log.debug("REST request to update Machine : {}, {}", id, machine);
        if (machine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, machine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return machineRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return machineRepository
                    .save(machine)
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
     * {@code PATCH  /machines/:id} : Partial updates given fields of an existing machine, field will ignore if it is null
     *
     * @param id the id of the machine to save.
     * @param machine the machine to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated machine,
     * or with status {@code 400 (Bad Request)} if the machine is not valid,
     * or with status {@code 404 (Not Found)} if the machine is not found,
     * or with status {@code 500 (Internal Server Error)} if the machine couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/machines/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<Machine>> partialUpdateMachine(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Machine machine
    ) throws URISyntaxException {
        log.debug("REST request to partial update Machine partially : {}, {}", id, machine);
        if (machine.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, machine.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return machineRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<Machine> result = machineRepository
                    .findById(machine.getId())
                    .map(existingMachine -> {
                        if (machine.getName() != null) {
                            existingMachine.setName(machine.getName());
                        }

                        return existingMachine;
                    })
                    .flatMap(machineRepository::save);

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
     * {@code GET  /machines} : get all the machines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of machines in body.
     */
    @GetMapping("/machines")
    public Mono<List<Machine>> getAllMachines() {
        log.debug("REST request to get all Machines");
        return machineRepository.findAll().collectList();
    }

    /**
     * {@code GET  /machines} : get all the machines as a stream.
     * @return the {@link Flux} of machines.
     */
    @GetMapping(value = "/machines", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<Machine> getAllMachinesAsStream() {
        log.debug("REST request to get all Machines as a stream");
        return machineRepository.findAll();
    }

    /**
     * {@code GET  /machines/:id} : get the "id" machine.
     *
     * @param id the id of the machine to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the machine, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/machines/{id}")
    public Mono<ResponseEntity<Machine>> getMachine(@PathVariable Long id) {
        log.debug("REST request to get Machine : {}", id);
        Mono<Machine> machine = machineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(machine);
    }

    /**
     * {@code DELETE  /machines/:id} : delete the "id" machine.
     *
     * @param id the id of the machine to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/machines/{id}")
    public Mono<ResponseEntity<Void>> deleteMachine(@PathVariable Long id) {
        log.debug("REST request to delete Machine : {}", id);
        return machineRepository
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
