package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.Badge;
import me.krft.frontend.repository.BadgeRepository;
import me.krft.frontend.repository.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link BadgeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class BadgeResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/badges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Badge badge;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Badge createEntity(EntityManager em) {
        Badge badge = new Badge().label(DEFAULT_LABEL).picture(DEFAULT_PICTURE).pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return badge;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Badge createUpdatedEntity(EntityManager em) {
        Badge badge = new Badge().label(UPDATED_LABEL).picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return badge;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Badge.class).block();
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
        badge = createEntity(em);
    }

    @Test
    void createBadge() throws Exception {
        int databaseSizeBeforeCreate = badgeRepository.findAll().collectList().block().size();
        // Create the Badge
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeCreate + 1);
        Badge testBadge = badgeList.get(badgeList.size() - 1);
        assertThat(testBadge.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBadge.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testBadge.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    void createBadgeWithExistingId() throws Exception {
        // Create the Badge with an existing ID
        badge.setId(1L);

        int databaseSizeBeforeCreate = badgeRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = badgeRepository.findAll().collectList().block().size();
        // set the field null
        badge.setLabel(null);

        // Create the Badge, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllBadgesAsStream() {
        // Initialize the database
        badgeRepository.save(badge).block();

        List<Badge> badgeList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Badge.class)
            .getResponseBody()
            .filter(badge::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(badgeList).isNotNull();
        assertThat(badgeList).hasSize(1);
        Badge testBadge = badgeList.get(0);
        assertThat(testBadge.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBadge.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testBadge.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    void getAllBadges() {
        // Initialize the database
        badgeRepository.save(badge).block();

        // Get all the badgeList
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
            .value(hasItem(badge.getId().intValue()))
            .jsonPath("$.[*].label")
            .value(hasItem(DEFAULT_LABEL))
            .jsonPath("$.[*].pictureContentType")
            .value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE))
            .jsonPath("$.[*].picture")
            .value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    void getBadge() {
        // Initialize the database
        badgeRepository.save(badge).block();

        // Get the badge
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, badge.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(badge.getId().intValue()))
            .jsonPath("$.label")
            .value(is(DEFAULT_LABEL))
            .jsonPath("$.pictureContentType")
            .value(is(DEFAULT_PICTURE_CONTENT_TYPE))
            .jsonPath("$.picture")
            .value(is(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    void getNonExistingBadge() {
        // Get the badge
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingBadge() throws Exception {
        // Initialize the database
        badgeRepository.save(badge).block();

        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();

        // Update the badge
        Badge updatedBadge = badgeRepository.findById(badge.getId()).block();
        updatedBadge.label(UPDATED_LABEL).picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedBadge.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
        Badge testBadge = badgeList.get(badgeList.size() - 1);
        assertThat(testBadge.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBadge.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testBadge.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void putNonExistingBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, badge.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateBadgeWithPatch() throws Exception {
        // Initialize the database
        badgeRepository.save(badge).block();

        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();

        // Update the badge using partial update
        Badge partialUpdatedBadge = new Badge();
        partialUpdatedBadge.setId(badge.getId());

        partialUpdatedBadge.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBadge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
        Badge testBadge = badgeList.get(badgeList.size() - 1);
        assertThat(testBadge.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testBadge.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testBadge.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void fullUpdateBadgeWithPatch() throws Exception {
        // Initialize the database
        badgeRepository.save(badge).block();

        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();

        // Update the badge using partial update
        Badge partialUpdatedBadge = new Badge();
        partialUpdatedBadge.setId(badge.getId());

        partialUpdatedBadge.label(UPDATED_LABEL).picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedBadge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedBadge))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
        Badge testBadge = badgeList.get(badgeList.size() - 1);
        assertThat(testBadge.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testBadge.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testBadge.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    void patchNonExistingBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, badge.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamBadge() throws Exception {
        int databaseSizeBeforeUpdate = badgeRepository.findAll().collectList().block().size();
        badge.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(badge))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Badge in the database
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteBadge() {
        // Initialize the database
        badgeRepository.save(badge).block();

        int databaseSizeBeforeDelete = badgeRepository.findAll().collectList().block().size();

        // Delete the badge
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, badge.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Badge> badgeList = badgeRepository.findAll().collectList().block();
        assertThat(badgeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
