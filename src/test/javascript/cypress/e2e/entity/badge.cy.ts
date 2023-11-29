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

describe('Badge e2e test', () => {
  const badgePageUrl = '/badge';
  const badgePageUrlPattern = new RegExp('/badge(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const badgeSample = { label: 'Buckinghamshire', picture: 'Phased Slovénie' };

  let badge;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/badges+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/badges').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/badges/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (badge) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/badges/${badge.id}`,
      }).then(() => {
        badge = undefined;
      });
    }
  });

  it('Badges menu should load Badges page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('badge');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Badge').should('exist');
    cy.url().should('match', badgePageUrlPattern);
  });

  describe('Badge page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(badgePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Badge page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/badge/new$'));
        cy.getEntityCreateUpdateHeading('Badge');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', badgePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/badges',
          body: badgeSample,
        }).then(({ body }) => {
          badge = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/badges+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [badge],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(badgePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Badge page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('badge');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', badgePageUrlPattern);
      });

      it('edit button click should load edit Badge page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Badge');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', badgePageUrlPattern);
      });

      it('edit button click should load edit Badge page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Badge');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', badgePageUrlPattern);
      });

      it('last delete button click should delete instance of Badge', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('badge').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', badgePageUrlPattern);

        badge = undefined;
      });
    });
  });

  describe('new Badge page', () => {
    beforeEach(() => {
      cy.visit(`${badgePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Badge');
    });

    it('should create an instance of Badge', () => {
      cy.get(`[data-cy="label"]`).type('hacking tolerance').should('have.value', 'hacking tolerance');

      cy.get(`[data-cy="picture"]`).type('holistic').should('have.value', 'holistic');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        badge = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', badgePageUrlPattern);
    });
  });
});
