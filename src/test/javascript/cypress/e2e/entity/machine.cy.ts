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

describe('Machine e2e test', () => {
  const machinePageUrl = '/machine';
  const machinePageUrlPattern = new RegExp('/machine(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const machineSample = { name: 'purple content' };

  let machine;
  let machineCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/krftme-microservice/api/machine-categories',
      body: { label: 'supply-chains partnerships Saint-Marin' },
    }).then(({ body }) => {
      machineCategory = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/krftme-microservice/api/machines+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/krftme-microservice/api/machines').as('postEntityRequest');
    cy.intercept('DELETE', '/services/krftme-microservice/api/machines/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/krftme-microservice/api/offers', {
      statusCode: 200,
      body: [],
    });

    cy.intercept('GET', '/services/krftme-microservice/api/machine-categories', {
      statusCode: 200,
      body: [machineCategory],
    });
  });

  afterEach(() => {
    if (machine) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/krftme-microservice/api/machines/${machine.id}`,
      }).then(() => {
        machine = undefined;
      });
    }
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

  it('Machines menu should load Machines page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('machine');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Machine').should('exist');
    cy.url().should('match', machinePageUrlPattern);
  });

  describe('Machine page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(machinePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Machine page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/machine/new$'));
        cy.getEntityCreateUpdateHeading('Machine');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machinePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/krftme-microservice/api/machines',
          body: {
            ...machineSample,
            category: machineCategory,
          },
        }).then(({ body }) => {
          machine = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/krftme-microservice/api/machines+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [machine],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(machinePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Machine page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('machine');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machinePageUrlPattern);
      });

      it('edit button click should load edit Machine page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Machine');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machinePageUrlPattern);
      });

      it('edit button click should load edit Machine page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Machine');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machinePageUrlPattern);
      });

      it('last delete button click should delete instance of Machine', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('machine').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', machinePageUrlPattern);

        machine = undefined;
      });
    });
  });

  describe('new Machine page', () => {
    beforeEach(() => {
      cy.visit(`${machinePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Machine');
    });

    it('should create an instance of Machine', () => {
      cy.get(`[data-cy="name"]`).type('Manager').should('have.value', 'Manager');

      cy.get(`[data-cy="category"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        machine = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', machinePageUrlPattern);
    });
  });
});
