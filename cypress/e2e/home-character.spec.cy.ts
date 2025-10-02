/// <reference types="cypress" />

describe('Rick & Morty App', () => {
    const baseUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    it('renders filters and character cards', () => {
        cy.get('[data-cy="filter-status"]').should('be.visible');
        cy.get('[data-cy="filter-gender"]').should('be.visible');
        cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
    });

    it('applies status filter and updates character cards', () => {
        cy.get('[data-cy="status-alive"]').check({ force: true });
        cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
        cy.url().should('include', 'status=alive');
    });

    it('navigates to character page and back preserving filters', () => {
        cy.get('[data-cy="status-alive"]').check({ force: true });
        cy.get('[data-cy="character-card"]').first().click();

        cy.get('[data-cy="character-overview"]').should('be.visible');
        cy.get('[data-cy="back-button"]').should('be.visible');

        cy.get('[data-cy="back-button"]').click();

        cy.url().should('include', '/');
        cy.url().should('include', 'status=alive');
        cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
    });

    it('checks pagination works', () => {
        cy.get('[data-cy="next-page"]').click();
        cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);

        cy.get('[data-cy="prev-page"]').click();
        cy.get('[data-cy="character-card"]').should('have.length.greaterThan', 0);
    });
});
