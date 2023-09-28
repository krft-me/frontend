package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.Showcase;
import me.krft.frontend.repository.EntityManager;
import me.krft.frontend.repository.ShowcaseRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ShowcaseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ShowcaseResourceIT {

    private static final UUID DEFAULT_IMAGE_ID = UUID.randomUUID();
    private static final UUID UPDATED_IMAGE_ID = UUID.randomUUID();

    private static final String ENTITY_API_URL = "/api/showcases";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShowcaseRepository showcaseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Showcase showcase;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Showcase createEntity(EntityManager em) {
        Showcase showcase = new Showcase().imageId(DEFAULT_IMAGE_ID);
        return showcase;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Showcase createUpdatedEntity(EntityManager em) {
        Showcase showcase = new Showcase().imageId(UPDATED_IMAGE_ID);
        return showcase;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Showcase.class).block();
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
        showcase = createEntity(em);
    }

    @Test
    void createShowcase() throws Exception {
        int databaseSizeBeforeCreate = showcaseRepository.findAll().collectList().block().size();
        // Create the Showcase
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeCreate + 1);
        Showcase testShowcase = showcaseList.get(showcaseList.size() - 1);
        assertThat(testShowcase.getImageId()).isEqualTo(DEFAULT_IMAGE_ID);
    }

    @Test
    void createShowcaseWithExistingId() throws Exception {
        // Create the Showcase with an existing ID
        showcase.setId(1L);

        int databaseSizeBeforeCreate = showcaseRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkImageIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = showcaseRepository.findAll().collectList().block().size();
        // set the field null
        showcase.setImageId(null);

        // Create the Showcase, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllShowcasesAsStream() {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        List<Showcase> showcaseList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Showcase.class)
            .getResponseBody()
            .filter(showcase::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(showcaseList).isNotNull();
        assertThat(showcaseList).hasSize(1);
        Showcase testShowcase = showcaseList.get(0);
        assertThat(testShowcase.getImageId()).isEqualTo(DEFAULT_IMAGE_ID);
    }

    @Test
    void getAllShowcases() {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        // Get all the showcaseList
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
            .value(hasItem(showcase.getId().intValue()))
            .jsonPath("$.[*].imageId")
            .value(hasItem(DEFAULT_IMAGE_ID.toString()));
    }

    @Test
    void getShowcase() {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        // Get the showcase
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, showcase.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(showcase.getId().intValue()))
            .jsonPath("$.imageId")
            .value(is(DEFAULT_IMAGE_ID.toString()));
    }

    @Test
    void getNonExistingShowcase() {
        // Get the showcase
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingShowcase() throws Exception {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();

        // Update the showcase
        Showcase updatedShowcase = showcaseRepository.findById(showcase.getId()).block();
        updatedShowcase.imageId(UPDATED_IMAGE_ID);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedShowcase.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedShowcase))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
        Showcase testShowcase = showcaseList.get(showcaseList.size() - 1);
        assertThat(testShowcase.getImageId()).isEqualTo(UPDATED_IMAGE_ID);
    }

    @Test
    void putNonExistingShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, showcase.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateShowcaseWithPatch() throws Exception {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();

        // Update the showcase using partial update
        Showcase partialUpdatedShowcase = new Showcase();
        partialUpdatedShowcase.setId(showcase.getId());

        partialUpdatedShowcase.imageId(UPDATED_IMAGE_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedShowcase.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedShowcase))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
        Showcase testShowcase = showcaseList.get(showcaseList.size() - 1);
        assertThat(testShowcase.getImageId()).isEqualTo(UPDATED_IMAGE_ID);
    }

    @Test
    void fullUpdateShowcaseWithPatch() throws Exception {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();

        // Update the showcase using partial update
        Showcase partialUpdatedShowcase = new Showcase();
        partialUpdatedShowcase.setId(showcase.getId());

        partialUpdatedShowcase.imageId(UPDATED_IMAGE_ID);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedShowcase.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedShowcase))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
        Showcase testShowcase = showcaseList.get(showcaseList.size() - 1);
        assertThat(testShowcase.getImageId()).isEqualTo(UPDATED_IMAGE_ID);
    }

    @Test
    void patchNonExistingShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, showcase.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamShowcase() throws Exception {
        int databaseSizeBeforeUpdate = showcaseRepository.findAll().collectList().block().size();
        showcase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(showcase))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Showcase in the database
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteShowcase() {
        // Initialize the database
        showcaseRepository.save(showcase).block();

        int databaseSizeBeforeDelete = showcaseRepository.findAll().collectList().block().size();

        // Delete the showcase
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, showcase.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Showcase> showcaseList = showcaseRepository.findAll().collectList().block();
        assertThat(showcaseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
