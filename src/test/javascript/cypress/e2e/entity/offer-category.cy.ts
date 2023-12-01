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

describe('OfferCategory e2e test', () => {
  const offerCategoryPageUrl = '/offer-category';
  const offerCategoryPageUrlPattern = new RegExp('/offer-category(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const offerCategorySample = { label: '24/7 Poitou-Charentes' };

  let offerCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/offer-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/offer-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/offer-categories/*').as('deleteEntityRequest');
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

  it('OfferCategories menu should load OfferCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('offer-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OfferCategory').should('exist');
    cy.url().should('match', offerCategoryPageUrlPattern);
  });

  describe('OfferCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(offerCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OfferCategory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/offer-category/new$'));
        cy.getEntityCreateUpdateHeading('OfferCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/offer-categories',
          body: offerCategorySample,
        }).then(({ body }) => {
          offerCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/offer-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [offerCategory],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(offerCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OfferCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('offerCategory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerCategoryPageUrlPattern);
      });

      it('edit button click should load edit OfferCategory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OfferCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerCategoryPageUrlPattern);
      });

      it('edit button click should load edit OfferCategory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OfferCategory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of OfferCategory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('offerCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', offerCategoryPageUrlPattern);

        offerCategory = undefined;
      });
    });
  });

  describe('new OfferCategory page', () => {
    beforeEach(() => {
      cy.visit(`${offerCategoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OfferCategory');
    });

    it('should create an instance of OfferCategory', () => {
      cy.get(`[data-cy="label"]`).type('withdrawal solution-oriented').should('have.value', 'withdrawal solution-oriented');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        offerCategory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', offerCategoryPageUrlPattern);
    });
  });
});
