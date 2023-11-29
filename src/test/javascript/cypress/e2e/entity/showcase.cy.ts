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

describe('Showcase e2e test', () => {
  const showcasePageUrl = '/showcase';
  const showcasePageUrlPattern = new RegExp('/showcase(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  // const showcaseSample = {"imageId":"91fb0b7b-1509-4bce-9f03-87798f022370"};

  let showcase;
  // let applicationUserOffer;

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/application-user-offers',
      body: {"description":"red reinvent","price":3455,"active":true},
    }).then(({ body }) => {
      applicationUserOffer = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/showcases+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/showcases').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/showcases/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/application-user-offers', {
      statusCode: 200,
      body: [applicationUserOffer],
    });

  });
   */

  afterEach(() => {
    if (showcase) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/showcases/${showcase.id}`,
      }).then(() => {
        showcase = undefined;
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
  });
   */

  it('Showcases menu should load Showcases page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('showcase');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Showcase').should('exist');
    cy.url().should('match', showcasePageUrlPattern);
  });

  describe('Showcase page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(showcasePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Showcase page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/showcase/new$'));
        cy.getEntityCreateUpdateHeading('Showcase');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', showcasePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/showcases',
          body: {
            ...showcaseSample,
            offer: applicationUserOffer,
          },
        }).then(({ body }) => {
          showcase = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/showcases+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [showcase],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(showcasePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(showcasePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details Showcase page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('showcase');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', showcasePageUrlPattern);
      });

      it('edit button click should load edit Showcase page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Showcase');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', showcasePageUrlPattern);
      });

      it('edit button click should load edit Showcase page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Showcase');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', showcasePageUrlPattern);
      });

      it.skip('last delete button click should delete instance of Showcase', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('showcase').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', showcasePageUrlPattern);

        showcase = undefined;
      });
    });
  });

  describe('new Showcase page', () => {
    beforeEach(() => {
      cy.visit(`${showcasePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Showcase');
    });

    it.skip('should create an instance of Showcase', () => {
      cy.get(`[data-cy="imageId"]`)
        .type('dc17b53b-8a6a-477b-ab48-8d9c236bf2bd')
        .invoke('val')
        .should('match', new RegExp('dc17b53b-8a6a-477b-ab48-8d9c236bf2bd'));

      cy.get(`[data-cy="offer"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        showcase = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', showcasePageUrlPattern);
    });
  });
});
