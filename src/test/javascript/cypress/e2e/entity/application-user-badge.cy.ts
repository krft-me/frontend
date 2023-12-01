import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('ApplicationUserBadge e2e test', () => {
  const applicationUserBadgePageUrl = '/application-user-badge';
  const applicationUserBadgePageUrlPattern = new RegExp('/application-user-badge(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const applicationUserBadgeSample = { obtainedDate: '2023-11-29T13:21:25.357Z' };

  let applicationUserBadge;
  let applicationUser;
  let badge;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/application-users',
      body: {
        firstName: 'Alliaume',
        lastName: 'Dumas',
        username: 'Keyboard',
        profilePictureId: 'b0da17eb-5bd6-4404-a94c-08de8f1f1edf',
      },
    }).then(({ body }) => {
      applicationUser = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/badges',
      body: { label: 'connecting', picture: 'payment' },
    }).then(({ body }) => {
      badge = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/application-user-badges+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/application-user-badges').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/application-user-badges/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/application-users', {
      statusCode: 200,
      body: [applicationUser],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/badges', {
      statusCode: 200,
      body: [badge],
    });
  });

  afterEach(() => {
    if (applicationUserBadge) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-user-badges/${applicationUserBadge.id}`,
      }).then(() => {
        applicationUserBadge = undefined;
      });
    }
  });

  afterEach(() => {
    if (applicationUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-users/${applicationUser.id}`,
      }).then(() => {
        applicationUser = undefined;
      });
    }
    if (badge) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/badges/${badge.id}`,
      }).then(() => {
        badge = undefined;
      });
    }
  });

  it('ApplicationUserBadges menu should load ApplicationUserBadges page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('application-user-badge');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ApplicationUserBadge').should('exist');
    cy.url().should('match', applicationUserBadgePageUrlPattern);
  });

  describe('ApplicationUserBadge page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(applicationUserBadgePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ApplicationUserBadge page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/application-user-badge/new$'));
        cy.getEntityCreateUpdateHeading('ApplicationUserBadge');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserBadgePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/application-user-badges',
          body: {
            ...applicationUserBadgeSample,
            user: applicationUser,
            badge: badge,
          },
        }).then(({ body }) => {
          applicationUserBadge = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/application-user-badges+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [applicationUserBadge],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(applicationUserBadgePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ApplicationUserBadge page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('applicationUserBadge');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserBadgePageUrlPattern);
      });

      it('edit button click should load edit ApplicationUserBadge page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationUserBadge');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserBadgePageUrlPattern);
      });

      it('edit button click should load edit ApplicationUserBadge page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationUserBadge');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserBadgePageUrlPattern);
      });

      it('last delete button click should delete instance of ApplicationUserBadge', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('applicationUserBadge').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserBadgePageUrlPattern);

        applicationUserBadge = undefined;
      });
    });
  });

  describe('new ApplicationUserBadge page', () => {
    beforeEach(() => {
      cy.visit(`${applicationUserBadgePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ApplicationUserBadge');
    });

    it('should create an instance of ApplicationUserBadge', () => {
      cy.get(`[data-cy="obtainedDate"]`).type('2023-11-29T11:44').blur().should('have.value', '2023-11-29T11:44');

      cy.get(`[data-cy="user"]`).select(1);
      cy.get(`[data-cy="badge"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        applicationUserBadge = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', applicationUserBadgePageUrlPattern);
    });
  });
});
