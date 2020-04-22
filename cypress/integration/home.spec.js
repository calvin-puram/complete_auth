/* eslint-disable no-undef */
describe('The Home Page', () => {
  it('should navigate to home and display page title', () => {
    cy.visit('/');

    cy.get('#home-page-title').should('contain', 'Fullstack Auth Application');
  });

  it('should check for the existance of sign in and login button', () => {
    cy.visit('/');

    cy.get('#register-button').should('contain', 'Register');
    cy.get('#login-button').should('contain', 'Login');
  });

  it('should navigate to login page when clicked', () => {
    cy.visit('/');

    cy.get('#login-button').click();

    cy.url().should('contain', '/login');
  });

  it('should navigate to register page when clicked', () => {
    cy.visit('/');

    cy.get('#register-button').click();

    cy.url().should('contain', '/register');
  });
});
