package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.ApplicationUserBadge;
import me.krft.frontend.repository.ApplicationUserBadgeRepository;
import me.krft.frontend.repository.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ApplicationUserBadgeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ApplicationUserBadgeResourceIT {

    private static final Instant DEFAULT_OBTENTION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_OBTENTION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/application-user-badges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationUserBadgeRepository applicationUserBadgeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private ApplicationUserBadge applicationUserBadge;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUserBadge createEntity(EntityManager em) {
        ApplicationUserBadge applicationUserBadge = new ApplicationUserBadge().obtentionDate(DEFAULT_OBTENTION_DATE);
        return applicationUserBadge;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUserBadge createUpdatedEntity(EntityManager em) {
        ApplicationUserBadge applicationUserBadge = new ApplicationUserBadge().obtentionDate(UPDATED_OBTENTION_DATE);
        return applicationUserBadge;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(ApplicationUserBadge.class).block();
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
        applicationUserBadge = createEntity(em);
    }

    @Test
    void createApplicationUserBadge() throws Exception {
        int databaseSizeBeforeCreate = applicationUserBadgeRepository.findAll().collectList().block().size();
        // Create the ApplicationUserBadge
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeCreate + 1);
        ApplicationUserBadge testApplicationUserBadge = applicationUserBadgeList.get(applicationUserBadgeList.size() - 1);
        assertThat(testApplicationUserBadge.getObtentionDate()).isEqualTo(DEFAULT_OBTENTION_DATE);
    }

    @Test
    void createApplicationUserBadgeWithExistingId() throws Exception {
        // Create the ApplicationUserBadge with an existing ID
        applicationUserBadge.setId(1L);

        int databaseSizeBeforeCreate = applicationUserBadgeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkObtentionDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserBadgeRepository.findAll().collectList().block().size();
        // set the field null
        applicationUserBadge.setObtentionDate(null);

        // Create the ApplicationUserBadge, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllApplicationUserBadgesAsStream() {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        List<ApplicationUserBadge> applicationUserBadgeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ApplicationUserBadge.class)
            .getResponseBody()
            .filter(applicationUserBadge::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(applicationUserBadgeList).isNotNull();
        assertThat(applicationUserBadgeList).hasSize(1);
        ApplicationUserBadge testApplicationUserBadge = applicationUserBadgeList.get(0);
        assertThat(testApplicationUserBadge.getObtentionDate()).isEqualTo(DEFAULT_OBTENTION_DATE);
    }

    @Test
    void getAllApplicationUserBadges() {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        // Get all the applicationUserBadgeList
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
            .value(hasItem(applicationUserBadge.getId().intValue()))
            .jsonPath("$.[*].obtentionDate")
            .value(hasItem(DEFAULT_OBTENTION_DATE.toString()));
    }

    @Test
    void getApplicationUserBadge() {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        // Get the applicationUserBadge
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, applicationUserBadge.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(applicationUserBadge.getId().intValue()))
            .jsonPath("$.obtentionDate")
            .value(is(DEFAULT_OBTENTION_DATE.toString()));
    }

    @Test
    void getNonExistingApplicationUserBadge() {
        // Get the applicationUserBadge
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingApplicationUserBadge() throws Exception {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();

        // Update the applicationUserBadge
        ApplicationUserBadge updatedApplicationUserBadge = applicationUserBadgeRepository.findById(applicationUserBadge.getId()).block();
        updatedApplicationUserBadge.obtentionDate(UPDATED_OBTENTION_DATE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedApplicationUserBadge.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedApplicationUserBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserBadge testApplicationUserBadge = applicationUserBadgeList.get(applicationUserBadgeList.size() - 1);
        assertThat(testApplicationUserBadge.getObtentionDate()).isEqualTo(UPDATED_OBTENTION_DATE);
    }

    @Test
    void putNonExistingApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, applicationUserBadge.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateApplicationUserBadgeWithPatch() throws Exception {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();

        // Update the applicationUserBadge using partial update
        ApplicationUserBadge partialUpdatedApplicationUserBadge = new ApplicationUserBadge();
        partialUpdatedApplicationUserBadge.setId(applicationUserBadge.getId());

        partialUpdatedApplicationUserBadge.obtentionDate(UPDATED_OBTENTION_DATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUserBadge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUserBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserBadge testApplicationUserBadge = applicationUserBadgeList.get(applicationUserBadgeList.size() - 1);
        assertThat(testApplicationUserBadge.getObtentionDate()).isEqualTo(UPDATED_OBTENTION_DATE);
    }

    @Test
    void fullUpdateApplicationUserBadgeWithPatch() throws Exception {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();

        // Update the applicationUserBadge using partial update
        ApplicationUserBadge partialUpdatedApplicationUserBadge = new ApplicationUserBadge();
        partialUpdatedApplicationUserBadge.setId(applicationUserBadge.getId());

        partialUpdatedApplicationUserBadge.obtentionDate(UPDATED_OBTENTION_DATE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUserBadge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUserBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserBadge testApplicationUserBadge = applicationUserBadgeList.get(applicationUserBadgeList.size() - 1);
        assertThat(testApplicationUserBadge.getObtentionDate()).isEqualTo(UPDATED_OBTENTION_DATE);
    }

    @Test
    void patchNonExistingApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, applicationUserBadge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamApplicationUserBadge() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserBadgeRepository.findAll().collectList().block().size();
        applicationUserBadge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserBadge))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUserBadge in the database
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteApplicationUserBadge() {
        // Initialize the database
        applicationUserBadgeRepository.save(applicationUserBadge).block();

        int databaseSizeBeforeDelete = applicationUserBadgeRepository.findAll().collectList().block().size();

        // Delete the applicationUserBadge
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, applicationUserBadge.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ApplicationUserBadge> applicationUserBadgeList = applicationUserBadgeRepository.findAll().collectList().block();
        assertThat(applicationUserBadgeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
