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

describe('Review e2e test', () => {
  const reviewPageUrl = '/review';
  const reviewPageUrlPattern = new RegExp('/review(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const reviewSample = {"rating":22};

  let review;
  // let order;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/orders',
      body: {"date":"2023-11-28T22:22:16.218Z","state":"UNSIGNED"},
    }).then(({ body }) => {
      order = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/reviews+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/reviews').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/reviews/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/orders', {
      statusCode: 200,
      body: [order],
    });

  });
   */

  afterEach(() => {
    if (review) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/reviews/${review.id}`,
      }).then(() => {
        review = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (order) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/orders/${order.id}`,
      }).then(() => {
        order = undefined;
      });
    }
  });
   */

  it('Reviews menu should load Reviews page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('review');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Review').should('exist');
    cy.url().should('match', reviewPageUrlPattern);
  });

  describe('Review page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(reviewPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Review page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/review/new$'));
        cy.getEntityCreateUpdateHeading('Review');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reviewPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/reviews',
          body: {
            ...reviewSample,
            order: order,
          },
        }).then(({ body }) => {
          review = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/reviews+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [review],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(reviewPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(reviewPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Review page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('review');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reviewPageUrlPattern);
      });

      it('edit button click should load edit Review page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Review');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reviewPageUrlPattern);
      });

      it('edit button click should load edit Review page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Review');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reviewPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Review', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('review').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', reviewPageUrlPattern);

        review = undefined;
      });
    });
  });

  describe('new Review page', () => {
    beforeEach(() => {
      cy.visit(`${reviewPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Review');
    });

    it.skip('should create an instance of Review', () => {
      cy.get(`[data-cy="rating"]`).type('40').should('have.value', '40');

      cy.get(`[data-cy="comment"]`)
        .type('input Saint-Christophe-et-Niévès systems')
        .should('have.value', 'input Saint-Christophe-et-Niévès systems');

      cy.get(`[data-cy="order"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        review = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', reviewPageUrlPattern);
    });
  });
});
