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

describe('City e2e test', () => {
  const cityPageUrl = '/city';
  const cityPageUrlPattern = new RegExp('/city(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const citySample = {"name":"calculate yellow","zipCode":"29160"};

  let city;
  // let region;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/regions',
      body: {"name":"Panama Metal"},
    }).then(({ body }) => {
      region = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/cities+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/cities').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/cities/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/application-users', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/regions', {
      statusCode: 200,
      body: [region],
    });

  });
   */

  afterEach(() => {
    if (city) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/cities/${city.id}`,
      }).then(() => {
        city = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (region) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/regions/${region.id}`,
      }).then(() => {
        region = undefined;
      });
    }
  });
   */

  it('Cities menu should load Cities page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('city');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('City').should('exist');
    cy.url().should('match', cityPageUrlPattern);
  });

  describe('City page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cityPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create City page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/city/new$'));
        cy.getEntityCreateUpdateHeading('City');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cityPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/cities',
          body: {
            ...citySample,
            region: region,
          },
        }).then(({ body }) => {
          city = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/cities+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [city],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(cityPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(cityPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details City page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('city');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cityPageUrlPattern);
      });

      it('edit button click should load edit City page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('City');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cityPageUrlPattern);
      });

      it('edit button click should load edit City page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('City');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cityPageUrlPattern);
      });

      it.skip('last delete button click should delete instance of City', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('city').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cityPageUrlPattern);

        city = undefined;
      });
    });
  });

  describe('new City page', () => {
    beforeEach(() => {
      cy.visit(`${cityPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('City');
    });

    it.skip('should create an instance of City', () => {
      cy.get(`[data-cy="name"]`).type('intuitive Bacon').should('have.value', 'intuitive Bacon');

      cy.get(`[data-cy="zipCode"]`).type('32537').should('have.value', '32537');

      cy.get(`[data-cy="region"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        city = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', cityPageUrlPattern);
    });
  });
});
