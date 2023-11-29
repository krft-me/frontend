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

describe('Region e2e test', () => {
  const regionPageUrl = '/region';
  const regionPageUrlPattern = new RegExp('/region(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const regionSample = { name: 'brand quantifying' };

  let region;
  let country;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/countries',
      body: { name: 'Granite ROI', isoCode: 'c' },
    }).then(({ body }) => {
      country = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/regions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/regions').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/regions/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/cities', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/countries', {
      statusCode: 200,
      body: [country],
    });
  });

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

  afterEach(() => {
    if (country) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/countries/${country.id}`,
      }).then(() => {
        country = undefined;
      });
    }
  });

  it('Regions menu should load Regions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('region');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Region').should('exist');
    cy.url().should('match', regionPageUrlPattern);
  });

  describe('Region page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(regionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Region page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/region/new$'));
        cy.getEntityCreateUpdateHeading('Region');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', regionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/regions',
          body: {
            ...regionSample,
            country: country,
          },
        }).then(({ body }) => {
          region = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/regions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [region],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(regionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Region page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('region');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', regionPageUrlPattern);
      });

      it('edit button click should load edit Region page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Region');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', regionPageUrlPattern);
      });

      it('edit button click should load edit Region page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Region');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', regionPageUrlPattern);
      });

      it('last delete button click should delete instance of Region', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('region').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', regionPageUrlPattern);

        region = undefined;
      });
    });
  });

  describe('new Region page', () => {
    beforeEach(() => {
      cy.visit(`${regionPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Region');
    });

    it('should create an instance of Region', () => {
      cy.get(`[data-cy="name"]`).type('program').should('have.value', 'program');

      cy.get(`[data-cy="country"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        region = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', regionPageUrlPattern);
    });
  });
});
