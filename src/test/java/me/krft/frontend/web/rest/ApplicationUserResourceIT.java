package me.krft.frontend.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import me.krft.frontend.IntegrationTest;
import me.krft.frontend.domain.ApplicationUser;
import me.krft.frontend.repository.ApplicationUserRepository;
import me.krft.frontend.repository.EntityManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Integration tests for the {@link ApplicationUserResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ApplicationUserResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PSEUDO = "AAAAAAAAAA";
    private static final String UPDATED_PSEUDO = "BBBBBBBBBB";

    private static final Double DEFAULT_AVERAGE_RATING = 1D;
    private static final Double UPDATED_AVERAGE_RATING = 2D;

    private static final String ENTITY_API_URL = "/api/application-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ApplicationUserRepository applicationUserRepository;

    @Mock
    private ApplicationUserRepository applicationUserRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private ApplicationUser applicationUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUser createEntity(EntityManager em) {
        ApplicationUser applicationUser = new ApplicationUser()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .pseudo(DEFAULT_PSEUDO)
            .averageRating(DEFAULT_AVERAGE_RATING);
        return applicationUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUser createUpdatedEntity(EntityManager em) {
        ApplicationUser applicationUser = new ApplicationUser()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .pseudo(UPDATED_PSEUDO)
            .averageRating(UPDATED_AVERAGE_RATING);
        return applicationUser;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll("rel_application_user__favorite_application_user").block();
            em.deleteAll("rel_application_user__favorite_offer").block();
            em.deleteAll(ApplicationUser.class).block();
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
        applicationUser = createEntity(em);
    }

    @Test
    void createApplicationUser() throws Exception {
        int databaseSizeBeforeCreate = applicationUserRepository.findAll().collectList().block().size();
        // Create the ApplicationUser
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeCreate + 1);
        ApplicationUser testApplicationUser = applicationUserList.get(applicationUserList.size() - 1);
        assertThat(testApplicationUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testApplicationUser.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testApplicationUser.getPseudo()).isEqualTo(DEFAULT_PSEUDO);
        assertThat(testApplicationUser.getAverageRating()).isEqualTo(DEFAULT_AVERAGE_RATING);
    }

    @Test
    void createApplicationUserWithExistingId() throws Exception {
        // Create the ApplicationUser with an existing ID
        applicationUser.setId(1L);

        int databaseSizeBeforeCreate = applicationUserRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserRepository.findAll().collectList().block().size();
        // set the field null
        applicationUser.setFirstName(null);

        // Create the ApplicationUser, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserRepository.findAll().collectList().block().size();
        // set the field null
        applicationUser.setLastName(null);

        // Create the ApplicationUser, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkPseudoIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserRepository.findAll().collectList().block().size();
        // set the field null
        applicationUser.setPseudo(null);

        // Create the ApplicationUser, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkAverageRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = applicationUserRepository.findAll().collectList().block().size();
        // set the field null
        applicationUser.setAverageRating(null);

        // Create the ApplicationUser, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllApplicationUsersAsStream() {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        List<ApplicationUser> applicationUserList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ApplicationUser.class)
            .getResponseBody()
            .filter(applicationUser::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(applicationUserList).isNotNull();
        assertThat(applicationUserList).hasSize(1);
        ApplicationUser testApplicationUser = applicationUserList.get(0);
        assertThat(testApplicationUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testApplicationUser.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testApplicationUser.getPseudo()).isEqualTo(DEFAULT_PSEUDO);
        assertThat(testApplicationUser.getAverageRating()).isEqualTo(DEFAULT_AVERAGE_RATING);
    }

    @Test
    void getAllApplicationUsers() {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        // Get all the applicationUserList
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
            .value(hasItem(applicationUser.getId().intValue()))
            .jsonPath("$.[*].firstName")
            .value(hasItem(DEFAULT_FIRST_NAME))
            .jsonPath("$.[*].lastName")
            .value(hasItem(DEFAULT_LAST_NAME))
            .jsonPath("$.[*].pseudo")
            .value(hasItem(DEFAULT_PSEUDO))
            .jsonPath("$.[*].averageRating")
            .value(hasItem(DEFAULT_AVERAGE_RATING.doubleValue()));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllApplicationUsersWithEagerRelationshipsIsEnabled() {
        when(applicationUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(applicationUserRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllApplicationUsersWithEagerRelationshipsIsNotEnabled() {
        when(applicationUserRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(applicationUserRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getApplicationUser() {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        // Get the applicationUser
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, applicationUser.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(applicationUser.getId().intValue()))
            .jsonPath("$.firstName")
            .value(is(DEFAULT_FIRST_NAME))
            .jsonPath("$.lastName")
            .value(is(DEFAULT_LAST_NAME))
            .jsonPath("$.pseudo")
            .value(is(DEFAULT_PSEUDO))
            .jsonPath("$.averageRating")
            .value(is(DEFAULT_AVERAGE_RATING.doubleValue()));
    }

    @Test
    void getNonExistingApplicationUser() {
        // Get the applicationUser
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingApplicationUser() throws Exception {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();

        // Update the applicationUser
        ApplicationUser updatedApplicationUser = applicationUserRepository.findById(applicationUser.getId()).block();
        updatedApplicationUser
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .pseudo(UPDATED_PSEUDO)
            .averageRating(UPDATED_AVERAGE_RATING);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedApplicationUser.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedApplicationUser))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUser testApplicationUser = applicationUserList.get(applicationUserList.size() - 1);
        assertThat(testApplicationUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testApplicationUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplicationUser.getPseudo()).isEqualTo(UPDATED_PSEUDO);
        assertThat(testApplicationUser.getAverageRating()).isEqualTo(UPDATED_AVERAGE_RATING);
    }

    @Test
    void putNonExistingApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, applicationUser.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateApplicationUserWithPatch() throws Exception {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();

        // Update the applicationUser using partial update
        ApplicationUser partialUpdatedApplicationUser = new ApplicationUser();
        partialUpdatedApplicationUser.setId(applicationUser.getId());

        partialUpdatedApplicationUser.lastName(UPDATED_LAST_NAME).pseudo(UPDATED_PSEUDO);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUser.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUser))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUser testApplicationUser = applicationUserList.get(applicationUserList.size() - 1);
        assertThat(testApplicationUser.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testApplicationUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplicationUser.getPseudo()).isEqualTo(UPDATED_PSEUDO);
        assertThat(testApplicationUser.getAverageRating()).isEqualTo(DEFAULT_AVERAGE_RATING);
    }

    @Test
    void fullUpdateApplicationUserWithPatch() throws Exception {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();

        // Update the applicationUser using partial update
        ApplicationUser partialUpdatedApplicationUser = new ApplicationUser();
        partialUpdatedApplicationUser.setId(applicationUser.getId());

        partialUpdatedApplicationUser
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .pseudo(UPDATED_PSEUDO)
            .averageRating(UPDATED_AVERAGE_RATING);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedApplicationUser.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedApplicationUser))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUser testApplicationUser = applicationUserList.get(applicationUserList.size() - 1);
        assertThat(testApplicationUser.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testApplicationUser.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testApplicationUser.getPseudo()).isEqualTo(UPDATED_PSEUDO);
        assertThat(testApplicationUser.getAverageRating()).isEqualTo(UPDATED_AVERAGE_RATING);
    }

    @Test
    void patchNonExistingApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, applicationUser.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamApplicationUser() throws Exception {
        int databaseSizeBeforeUpdate = applicationUserRepository.findAll().collectList().block().size();
        applicationUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(applicationUser))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the ApplicationUser in the database
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteApplicationUser() {
        // Initialize the database
        applicationUserRepository.save(applicationUser).block();

        int databaseSizeBeforeDelete = applicationUserRepository.findAll().collectList().block().size();

        // Delete the applicationUser
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, applicationUser.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<ApplicationUser> applicationUserList = applicationUserRepository.findAll().collectList().block();
        assertThat(applicationUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
