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

describe('ApplicationUserOffer e2e test', () => {
  const applicationUserOfferPageUrl = '/application-user-offer';
  const applicationUserOfferPageUrlPattern = new RegExp('/application-user-offer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const applicationUserOfferSample = {"description":"Borders","price":84078,"active":false};

  let applicationUserOffer;
  // let applicationUser;
  // let offer;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/application-users',
      body: {"firstName":"Armine","lastName":"Brun","username":"Analyste","profilePictureId":"3b31a04a-8b6d-4c5d-aece-f62a2128192e"},
    }).then(({ body }) => {
      applicationUser = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/offers',
      body: {"name":"infomediaries Ariary"},
    }).then(({ body }) => {
      offer = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/application-user-offers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/application-user-offers').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/application-user-offers/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/showcases', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/orders', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/tags', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/application-users', {
      statusCode: 200,
      body: [applicationUser],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/offers', {
      statusCode: 200,
      body: [offer],
    });

  });
   */

  afterEach(() => {
    if (applicationUserOffer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-user-offers/${applicationUserOffer.id}`,
      }).then(() => {
        applicationUserOffer = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (applicationUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-users/${applicationUser.id}`,
      }).then(() => {
        applicationUser = undefined;
      });
    }
    if (offer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/offers/${offer.id}`,
      }).then(() => {
        offer = undefined;
      });
    }
  });
   */

  it('ApplicationUserOffers menu should load ApplicationUserOffers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('application-user-offer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ApplicationUserOffer').should('exist');
    cy.url().should('match', applicationUserOfferPageUrlPattern);
  });

  describe('ApplicationUserOffer page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(applicationUserOfferPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ApplicationUserOffer page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/application-user-offer/new$'));
        cy.getEntityCreateUpdateHeading('ApplicationUserOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserOfferPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/application-user-offers',
          body: {
            ...applicationUserOfferSample,
            provider: applicationUser,
            offer: offer,
          },
        }).then(({ body }) => {
          applicationUserOffer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/application-user-offers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [applicationUserOffer],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(applicationUserOfferPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(applicationUserOfferPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details ApplicationUserOffer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('applicationUserOffer');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserOfferPageUrlPattern);
      });

      it('edit button click should load edit ApplicationUserOffer page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationUserOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserOfferPageUrlPattern);
      });

      it('edit button click should load edit ApplicationUserOffer page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ApplicationUserOffer');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserOfferPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of ApplicationUserOffer', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('applicationUserOffer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', applicationUserOfferPageUrlPattern);

        applicationUserOffer = undefined;
      });
    });
  });

  describe('new ApplicationUserOffer page', () => {
    beforeEach(() => {
      cy.visit(`${applicationUserOfferPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ApplicationUserOffer');
    });

    it.skip('should create an instance of ApplicationUserOffer', () => {
      cy.get(`[data-cy="description"]`).type('copy e-services').should('have.value', 'copy e-services');

      cy.get(`[data-cy="price"]`).type('83032').should('have.value', '83032');

      cy.get(`[data-cy="active"]`).should('not.be.checked');
      cy.get(`[data-cy="active"]`).click().should('be.checked');

      cy.get(`[data-cy="provider"]`).select(1);
      cy.get(`[data-cy="offer"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        applicationUserOffer = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', applicationUserOfferPageUrlPattern);
    });
  });
});
