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
import me.krft.frontend.domain.Offer;
import me.krft.frontend.repository.EntityManager;
import me.krft.frontend.repository.OfferRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link OfferResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class OfferResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/offers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Offer offer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offer createEntity(EntityManager em) {
        Offer offer = new Offer().name(DEFAULT_NAME);
        return offer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Offer createUpdatedEntity(EntityManager em) {
        Offer offer = new Offer().name(UPDATED_NAME);
        return offer;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Offer.class).block();
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
        offer = createEntity(em);
    }

    @Test
    void createOffer() throws Exception {
        int databaseSizeBeforeCreate = offerRepository.findAll().collectList().block().size();
        // Create the Offer
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeCreate + 1);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createOfferWithExistingId() throws Exception {
        // Create the Offer with an existing ID
        offer.setId(1L);

        int databaseSizeBeforeCreate = offerRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = offerRepository.findAll().collectList().block().size();
        // set the field null
        offer.setName(null);

        // Create the Offer, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllOffersAsStream() {
        // Initialize the database
        offerRepository.save(offer).block();

        List<Offer> offerList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(Offer.class)
            .getResponseBody()
            .filter(offer::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(offerList).isNotNull();
        assertThat(offerList).hasSize(1);
        Offer testOffer = offerList.get(0);
        assertThat(testOffer.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void getAllOffers() {
        // Initialize the database
        offerRepository.save(offer).block();

        // Get all the offerList
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
            .value(hasItem(offer.getId().intValue()))
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getOffer() {
        // Initialize the database
        offerRepository.save(offer).block();

        // Get the offer
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, offer.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(offer.getId().intValue()))
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingOffer() {
        // Get the offer
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingOffer() throws Exception {
        // Initialize the database
        offerRepository.save(offer).block();

        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();

        // Update the offer
        Offer updatedOffer = offerRepository.findById(offer.getId()).block();
        updatedOffer.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedOffer.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, offer.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateOfferWithPatch() throws Exception {
        // Initialize the database
        offerRepository.save(offer).block();

        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();

        // Update the offer using partial update
        Offer partialUpdatedOffer = new Offer();
        partialUpdatedOffer.setId(offer.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedOffer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void fullUpdateOfferWithPatch() throws Exception {
        // Initialize the database
        offerRepository.save(offer).block();

        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();

        // Update the offer using partial update
        Offer partialUpdatedOffer = new Offer();
        partialUpdatedOffer.setId(offer.getId());

        partialUpdatedOffer.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedOffer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedOffer))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
        Offer testOffer = offerList.get(offerList.size() - 1);
        assertThat(testOffer.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, offer.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamOffer() throws Exception {
        int databaseSizeBeforeUpdate = offerRepository.findAll().collectList().block().size();
        offer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(offer))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Offer in the database
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteOffer() {
        // Initialize the database
        offerRepository.save(offer).block();

        int databaseSizeBeforeDelete = offerRepository.findAll().collectList().block().size();

        // Delete the offer
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, offer.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Offer> offerList = offerRepository.findAll().collectList().block();
        assertThat(offerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
