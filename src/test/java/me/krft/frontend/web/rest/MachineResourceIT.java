package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.Machine;
import me.krft.frontend.repository.EntityManager;
import me.krft.frontend.repository.MachineRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link MachineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class MachineResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/machines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Machine machine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Machine createEntity(EntityManager em) {
        Machine machine = new Machine().name(DEFAULT_NAME);
        return machine;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Machine createUpdatedEntity(EntityManager em) {
        Machine machine = new Machine().name(UPDATED_NAME);
        return machine;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Machine.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        machine = createEntity(em);
    }

    @Test
    void createMachine() throws Exception {
        int databaseSizeBeforeCreate = machineRepository.findAll().collectList().block().size();
        // Create the Machine
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeCreate + 1);
        Machine testMachine = machineList.get(machineList.size() - 1);
        assertThat(testMachine.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createMachineWithExistingId() throws Exception {
        // Create the Machine with an existing ID
        machine.setId(1L);

        int databaseSizeBeforeCreate = machineRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = machineRepository.findAll().collectList().block().size();
        // set the field null
        machine.setName(null);

        // Create the Machine, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllMachinesAsStream() {
        // Initialize the database
        machineRepository.save(machine).block();

        List<Machine> machineList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Machine.class)
            .getResponseBody()
            .filter(machine::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(machineList).isNotNull();
        assertThat(machineList).hasSize(1);
        Machine testMachine = machineList.get(0);
        assertThat(testMachine.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllMachines() {
        // Initialize the database
        machineRepository.save(machine).block();

        // Get all the machineList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(machine.getId().intValue()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getMachine() {
        // Initialize the database
        machineRepository.save(machine).block();

        // Get the machine
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, machine.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(machine.getId().intValue()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingMachine() {
        // Get the machine
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingMachine() throws Exception {
        // Initialize the database
        machineRepository.save(machine).block();

        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();

        // Update the machine
        Machine updatedMachine = machineRepository.findById(machine.getId()).block();
        updatedMachine.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedMachine.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedMachine))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
        Machine testMachine = machineList.get(machineList.size() - 1);
        assertThat(testMachine.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, machine.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateMachineWithPatch() throws Exception {
        // Initialize the database
        machineRepository.save(machine).block();

        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();

        // Update the machine using partial update
        Machine partialUpdatedMachine = new Machine();
        partialUpdatedMachine.setId(machine.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMachine.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedMachine))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
        Machine testMachine = machineList.get(machineList.size() - 1);
        assertThat(testMachine.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void fullUpdateMachineWithPatch() throws Exception {
        // Initialize the database
        machineRepository.save(machine).block();

        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();

        // Update the machine using partial update
        Machine partialUpdatedMachine = new Machine();
        partialUpdatedMachine.setId(machine.getId());

        partialUpdatedMachine.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedMachine.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedMachine))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
        Machine testMachine = machineList.get(machineList.size() - 1);
        assertThat(testMachine.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, machine.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamMachine() throws Exception {
        int databaseSizeBeforeUpdate = machineRepository.findAll().collectList().block().size();
        machine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(machine))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Machine in the database
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteMachine() {
        // Initialize the database
        machineRepository.save(machine).block();

        int databaseSizeBeforeDelete = machineRepository.findAll().collectList().block().size();

        // Delete the machine
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, machine.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Machine> machineList = machineRepository.findAll().collectList().block();
        assertThat(machineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
