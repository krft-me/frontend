package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.Rating;
import me.krft.frontend.repository.EntityManager;
import me.krft.frontend.repository.RatingRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link RatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class RatingResourceIT {

    private static final Double DEFAULT_RATE = 1D;
    private static final Double UPDATED_RATE = 2D;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Rating rating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rating createEntity(EntityManager em) {
        Rating rating = new Rating().rate(DEFAULT_RATE).comment(DEFAULT_COMMENT);
        return rating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rating createUpdatedEntity(EntityManager em) {
        Rating rating = new Rating().rate(UPDATED_RATE).comment(UPDATED_COMMENT);
        return rating;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Rating.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void setupCsrf() {
        webTestClient = webTestClient.mutateWith(csrf());
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        rating = createEntity(em);
    }

    @Test
    void createRating() throws Exception {
        int databaseSizeBeforeCreate = ratingRepository.findAll().collectList().block().size();
        // Create the Rating
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeCreate + 1);
        Rating testRating = ratingList.get(ratingList.size() - 1);
        assertThat(testRating.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    void createRatingWithExistingId() throws Exception {
        // Create the Rating with an existing ID
        rating.setId(1L);

        int databaseSizeBeforeCreate = ratingRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkRateIsRequired() throws Exception {
        int databaseSizeBeforeTest = ratingRepository.findAll().collectList().block().size();
        // set the field null
        rating.setRate(null);

        // Create the Rating, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllRatingsAsStream() {
        // Initialize the database
        ratingRepository.save(rating).block();

        List<Rating> ratingList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Rating.class)
            .getResponseBody()
            .filter(rating::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(ratingList).isNotNull();
        assertThat(ratingList).hasSize(1);
        Rating testRating = ratingList.get(0);
        assertThat(testRating.getRate()).isEqualTo(DEFAULT_RATE);
        assertThat(testRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    void getAllRatings() {
        // Initialize the database
        ratingRepository.save(rating).block();

        // Get all the ratingList
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
            .value(hasItem(rating.getId().intValue()))
            .jsonPath("$.[*].rate")
            .value(hasItem(DEFAULT_RATE.doubleValue()))
            .jsonPath("$.[*].comment")
            .value(hasItem(DEFAULT_COMMENT));
    }

    @Test
    void getRating() {
        // Initialize the database
        ratingRepository.save(rating).block();

        // Get the rating
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, rating.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(rating.getId().intValue()))
            .jsonPath("$.rate")
            .value(is(DEFAULT_RATE.doubleValue()))
            .jsonPath("$.comment")
            .value(is(DEFAULT_COMMENT));
    }

    @Test
    void getNonExistingRating() {
        // Get the rating
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingRating() throws Exception {
        // Initialize the database
        ratingRepository.save(rating).block();

        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();

        // Update the rating
        Rating updatedRating = ratingRepository.findById(rating.getId()).block();
        updatedRating.rate(UPDATED_RATE).comment(UPDATED_COMMENT);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedRating.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedRating))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
        Rating testRating = ratingList.get(ratingList.size() - 1);
        assertThat(testRating.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    void putNonExistingRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, rating.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateRatingWithPatch() throws Exception {
        // Initialize the database
        ratingRepository.save(rating).block();

        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();

        // Update the rating using partial update
        Rating partialUpdatedRating = new Rating();
        partialUpdatedRating.setId(rating.getId());

        partialUpdatedRating.rate(UPDATED_RATE).comment(UPDATED_COMMENT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedRating.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedRating))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
        Rating testRating = ratingList.get(ratingList.size() - 1);
        assertThat(testRating.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    void fullUpdateRatingWithPatch() throws Exception {
        // Initialize the database
        ratingRepository.save(rating).block();

        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();

        // Update the rating using partial update
        Rating partialUpdatedRating = new Rating();
        partialUpdatedRating.setId(rating.getId());

        partialUpdatedRating.rate(UPDATED_RATE).comment(UPDATED_COMMENT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedRating.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedRating))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
        Rating testRating = ratingList.get(ratingList.size() - 1);
        assertThat(testRating.getRate()).isEqualTo(UPDATED_RATE);
        assertThat(testRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    void patchNonExistingRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, rating.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamRating() throws Exception {
        int databaseSizeBeforeUpdate = ratingRepository.findAll().collectList().block().size();
        rating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(rating))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Rating in the database
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteRating() {
        // Initialize the database
        ratingRepository.save(rating).block();

        int databaseSizeBeforeDelete = ratingRepository.findAll().collectList().block().size();

        // Delete the rating
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, rating.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Rating> ratingList = ratingRepository.findAll().collectList().block();
        assertThat(ratingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
