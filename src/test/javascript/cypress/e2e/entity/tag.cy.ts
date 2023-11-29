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

describe('Tag e2e test', () => {
  const tagPageUrl = '/tag';
  const tagPageUrlPattern = new RegExp('/tag(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const tagSample = { label: 'Wooden' };

  let tag;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/tags+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/tags').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/tags/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tag) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/tags/${tag.id}`,
      }).then(() => {
        tag = undefined;
      });
    }
  });

  it('Tags menu should load Tags page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Tag').should('exist');
    cy.url().should('match', tagPageUrlPattern);
  });

  describe('Tag page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tagPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Tag page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tag/new$'));
        cy.getEntityCreateUpdateHeading('Tag');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tagPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/tags',
          body: tagSample,
        }).then(({ body }) => {
          tag = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/tags+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [tag],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(tagPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Tag page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tag');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tagPageUrlPattern);
      });

      it('edit button click should load edit Tag page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tag');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tagPageUrlPattern);
      });

      it('edit button click should load edit Tag page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tag');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tagPageUrlPattern);
      });

      it('last delete button click should delete instance of Tag', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('tag').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', tagPageUrlPattern);

        tag = undefined;
      });
    });
  });

  describe('new Tag page', () => {
    beforeEach(() => {
      cy.visit(`${tagPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Tag');
    });

    it('should create an instance of Tag', () => {
      cy.get(`[data-cy="label"]`).type('Card multi-tasking compressing').should('have.value', 'Card multi-tasking compressing');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        tag = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', tagPageUrlPattern);
    });
  });
});
