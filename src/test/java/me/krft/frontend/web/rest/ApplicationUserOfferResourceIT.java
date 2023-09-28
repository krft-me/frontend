package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.ApplicationUserOffer;
import me.krft.frontend.repository.ApplicationUserOfferRepository;
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
 * Integration tests for the {@link ApplicationUserOfferResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ApplicationUserOfferResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/application-user-offers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationUserOfferRepository applicationUserOfferRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private ApplicationUserOffer applicationUserOffer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUserOffer createEntity(EntityManager em) {
        ApplicationUserOffer applicationUserOffer = new ApplicationUserOffer().description(DEFAULT_DESCRIPTION);
        return applicationUserOffer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUserOffer createUpdatedEntity(EntityManager em) {
        ApplicationUserOffer applicationUserOffer = new ApplicationUserOffer().description(UPDATED_DESCRIPTION);
        return applicationUserOffer;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(ApplicationUserOffer.class).block();
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
        applicationUserOffer = createEntity(em);
    }

    @Test
    void createApplicationUserOffer() throws Exception {
        int databaseSizeBeforeCreate = applicationUserOfferRepository.findAll().collectList().block().size();
        // Create the ApplicationUserOffer
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeCreate + 1);
        ApplicationUserOffer testApplicationUserOffer = applicationUserOfferList.get(applicationUserOfferList.size() - 1);
        assertThat(testApplicationUserOffer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createApplicationUserOfferWithExistingId() throws Exception {
        // Create the ApplicationUserOffer with an existing ID
        applicationUserOffer.setId(1L);

        int databaseSizeBeforeCreate = applicationUserOfferRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserOfferRepository.findAll().collectList().block().size();
        // set the field null
        applicationUserOffer.setDescription(null);

        // Create the ApplicationUserOffer, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllApplicationUserOffersAsStream() {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        List<ApplicationUserOffer> applicationUserOfferList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ApplicationUserOffer.class)
            .getResponseBody()
            .filter(applicationUserOffer::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(applicationUserOfferList).isNotNull();
        assertThat(applicationUserOfferList).hasSize(1);
        ApplicationUserOffer testApplicationUserOffer = applicationUserOfferList.get(0);
        assertThat(testApplicationUserOffer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void getAllApplicationUserOffers() {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        // Get all the applicationUserOfferList
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
            .value(hasItem(applicationUserOffer.getId().intValue()))
            .jsonPath("$.[*].description")
            .value(hasItem(DEFAULT_DESCRIPTION));
    }

    @Test
    void getApplicationUserOffer() {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        // Get the applicationUserOffer
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, applicationUserOffer.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(applicationUserOffer.getId().intValue()))
            .jsonPath("$.description")
            .value(is(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingApplicationUserOffer() {
        // Get the applicationUserOffer
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingApplicationUserOffer() throws Exception {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();

        // Update the applicationUserOffer
        ApplicationUserOffer updatedApplicationUserOffer = applicationUserOfferRepository.findById(applicationUserOffer.getId()).block();
        updatedApplicationUserOffer.description(UPDATED_DESCRIPTION);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedApplicationUserOffer.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedApplicationUserOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserOffer testApplicationUserOffer = applicationUserOfferList.get(applicationUserOfferList.size() - 1);
        assertThat(testApplicationUserOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, applicationUserOffer.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateApplicationUserOfferWithPatch() throws Exception {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();

        // Update the applicationUserOffer using partial update
        ApplicationUserOffer partialUpdatedApplicationUserOffer = new ApplicationUserOffer();
        partialUpdatedApplicationUserOffer.setId(applicationUserOffer.getId());

        partialUpdatedApplicationUserOffer.description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUserOffer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUserOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserOffer testApplicationUserOffer = applicationUserOfferList.get(applicationUserOfferList.size() - 1);
        assertThat(testApplicationUserOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void fullUpdateApplicationUserOfferWithPatch() throws Exception {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();

        // Update the applicationUserOffer using partial update
        ApplicationUserOffer partialUpdatedApplicationUserOffer = new ApplicationUserOffer();
        partialUpdatedApplicationUserOffer.setId(applicationUserOffer.getId());

        partialUpdatedApplicationUserOffer.description(UPDATED_DESCRIPTION);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUserOffer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUserOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUserOffer testApplicationUserOffer = applicationUserOfferList.get(applicationUserOfferList.size() - 1);
        assertThat(testApplicationUserOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, applicationUserOffer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamApplicationUserOffer() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserOfferRepository.findAll().collectList().block().size();
        applicationUserOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUserOffer))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUserOffer in the database
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteApplicationUserOffer() {
        // Initialize the database
        applicationUserOfferRepository.save(applicationUserOffer).block();

        int databaseSizeBeforeDelete = applicationUserOfferRepository.findAll().collectList().block().size();

        // Delete the applicationUserOffer
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, applicationUserOffer.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ApplicationUserOffer> applicationUserOfferList = applicationUserOfferRepository.findAll().collectList().block();
        assertThat(applicationUserOfferList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
