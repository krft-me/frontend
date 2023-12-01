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

describe('Offer e2e test', () => {
  const offerPageUrl = '/offer';
  const offerPageUrlPattern = new RegExp('/offer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const offerSample = { name: 'Berkshire' };

  let offer;
  let offerCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/offer-categories',
      body: { label: 'leverage' },
    }).then(({ body }) => {
      offerCategory = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/offers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/offers').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/offers/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/application-user-offers', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/machines', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/offer-categories', {
      statusCode: 200,
      body: [offerCategory],
    });
  });

  afterEach(() => {
    if (offer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/offers/${offer.id}`,
      }).then(() => {
        offer = undefined;
      });
    }
  });

  afterEach(() => {
    if (offerCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/offer-categories/${offerCategory.id}`,
      }).then(() => {
        offerCategory = undefined;
      });
    }
  });

  it('Offers menu should load Offers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('offer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Offer').should('exist');
    cy.url().should('match', offerPageUrlPattern);
  });

  describe('Offer page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(offerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Offer page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/offer/new$'));
        cy.getEntityCreateUpdateHeading('Offer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/offers',
          body: {
            ...offerSample,
            category: offerCategory,
          },
        }).then(({ body }) => {
          offer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/offers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [offer],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(offerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Offer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('offer');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerPageUrlPattern);
      });

      it('edit button click should load edit Offer page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Offer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerPageUrlPattern);
      });

      it('edit button click should load edit Offer page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Offer');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerPageUrlPattern);
      });

      it('last delete button click should delete instance of Offer', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('offer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerPageUrlPattern);

        offer = undefined;
      });
    });
  });

  describe('new Offer page', () => {
    beforeEach(() => {
      cy.visit(`${offerPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Offer');
    });

    it('should create an instance of Offer', () => {
      cy.get(`[data-cy="name"]`).type('IB').should('have.value', 'IB');

      cy.get(`[data-cy="category"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        offer = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', offerPageUrlPattern);
    });
  });
});
