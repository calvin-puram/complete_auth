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
});
