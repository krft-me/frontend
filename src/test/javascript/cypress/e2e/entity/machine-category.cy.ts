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

describe('MachineCategory e2e test', () => {
  const machineCategoryPageUrl = '/machine-category';
  const machineCategoryPageUrlPattern = new RegExp('/machine-category(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const machineCategorySample = { label: 'transition Outdoors Rustic' };

  let machineCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/machine-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/machine-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/machine-categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (machineCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/machine-categories/${machineCategory.id}`,
      }).then(() => {
        machineCategory = undefined;
      });
    }
  });

  it('MachineCategories menu should load MachineCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('machine-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MachineCategory').should('exist');
    cy.url().should('match', machineCategoryPageUrlPattern);
  });

  describe('MachineCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(machineCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MachineCategory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/machine-category/new$'));
        cy.getEntityCreateUpdateHeading('MachineCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machineCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/machine-categories',
          body: machineCategorySample,
        }).then(({ body }) => {
          machineCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/machine-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [machineCategory],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(machineCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MachineCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('machineCategory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machineCategoryPageUrlPattern);
      });

      it('edit button click should load edit MachineCategory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MachineCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machineCategoryPageUrlPattern);
      });

      it('edit button click should load edit MachineCategory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MachineCategory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machineCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of MachineCategory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('machineCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machineCategoryPageUrlPattern);

        machineCategory = undefined;
      });
    });
  });

  describe('new MachineCategory page', () => {
    beforeEach(() => {
      cy.visit(`${machineCategoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MachineCategory');
    });

    it('should create an instance of MachineCategory', () => {
      cy.get(`[data-cy="label"]`).type('du').should('have.value', 'du');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        machineCategory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', machineCategoryPageUrlPattern);
    });
  });
});
