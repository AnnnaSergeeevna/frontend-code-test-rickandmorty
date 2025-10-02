/// <reference types="cypress" />

describe('Rick & Morty App E2E', () => {
    const baseUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    it('applies filters and paginates', () => {
        cy.get('[data-cy="status-alive"]').check({ force: true });
        cy.get('[data-cy="gender-male"]').check({ force: true });

        cy.url().should('include', 'status=alive');
        cy.url().should('include', 'gender=male');

        cy.get('[data-cy="page-2"]').click();
        cy.url().should('include', 'page=2');
    });

    it('navigates to a character page and back', () => {
        cy.get('[data-cy="status-alive"]').check({ force: true });
        cy.get('[data-cy="gender-male"]').check({ force: true });

        cy.get('[data-cy="character-card"]').first().click();

        cy.url().should('include', '/character/');
        cy.get('[data-cy="character-overview"]').should('exist');
        cy.get('[data-cy="episode-carousel"]').should('exist');

        cy.get('[data-cy="carousel-next"]').click();
        cy.get('[data-cy="carousel-prev"]').should('not.be.disabled');

        cy.get('[data-cy="back-button"]').click();
        cy.url().should('include', 'status=alive');
        cy.url().should('include', 'gender=male');
    });

    it('checks episode carousel navigation', () => {
        cy.get('[data-cy="character-card"]').first().click();

        cy.get('[data-cy="episode-carousel"]').within(() => {
            cy.get('[data-cy="carousel-next"]').click();
            cy.get('[data-cy="carousel-prev"]').should('not.be.disabled');
        });
    });
});
