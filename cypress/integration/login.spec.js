/* eslint-disable no-undef */
describe('The Login Process', () => {
  it('should login a user, flash message and redirect to homepage', () => {
    cy.server();
    cy.fixture('user.json').as('user');
    cy.route('POST', '/api/v1/auth/login', '@user');

    cy.visit('/login');

    cy.get("input[name='email']").type('cpuram1@gmail.com');
    cy.get("input[name='password']").type('2begood4');
    cy.get('#submit-login').click();

    cy.get('#logout').should('contain', 'Logout');
    cy.get('#name').should('contain', 'calvin');
    cy.get('#welcome').should('contain', 'Welcome calvin');
  });
});
