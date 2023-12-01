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

describe('Order e2e test', () => {
  const orderPageUrl = '/order';
  const orderPageUrlPattern = new RegExp('/order(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const orderSample = {"date":"2023-11-29T05:07:52.949Z","state":"CANCELLED"};

  let order;
  // let applicationUserOffer;
  // let applicationUser;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/application-user-offers',
      body: {"description":"benchmark customized c","price":76716,"active":true},
    }).then(({ body }) => {
      applicationUserOffer = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/application-users',
      body: {"firstName":"Eudoxe","lastName":"Roussel","username":"Champagne-Ardenne Table","profilePictureId":"d6703bf5-c35d-4aff-ac62-a8681562a79a"},
    }).then(({ body }) => {
      applicationUser = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/orders+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/orders').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/orders/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/reviews', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/application-user-offers', {
      statusCode: 200,
      body: [applicationUserOffer],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/application-users', {
      statusCode: 200,
      body: [applicationUser],
    });

  });
   */

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

  /* Disabled due to incompatibility
  afterEach(() => {
    if (applicationUserOffer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-user-offers/${applicationUserOffer.id}`,
      }).then(() => {
        applicationUserOffer = undefined;
      });
    }
    if (applicationUser) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/application-users/${applicationUser.id}`,
      }).then(() => {
        applicationUser = undefined;
      });
    }
  });
   */

  it('Orders menu should load Orders page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Order').should('exist');
    cy.url().should('match', orderPageUrlPattern);
  });

  describe('Order page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Order page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/order/new$'));
        cy.getEntityCreateUpdateHeading('Order');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/orders',
          body: {
            ...orderSample,
            offer: applicationUserOffer,
            customer: applicationUser,
          },
        }).then(({ body }) => {
          order = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/orders+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [order],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(orderPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Order page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('order');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderPageUrlPattern);
      });

      it('edit button click should load edit Order page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Order');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderPageUrlPattern);
      });

      it('edit button click should load edit Order page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Order');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Order', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('order').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', orderPageUrlPattern);

        order = undefined;
      });
    });
  });

  describe('new Order page', () => {
    beforeEach(() => {
      cy.visit(`${orderPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Order');
    });

    it.skip('should create an instance of Order', () => {
      cy.get(`[data-cy="date"]`).type('2023-11-28T20:56').blur().should('have.value', '2023-11-28T20:56');

      cy.get(`[data-cy="state"]`).select('WAITING');

      cy.get(`[data-cy="offer"]`).select(1);
      cy.get(`[data-cy="customer"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        order = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', orderPageUrlPattern);
    });
  });
});
