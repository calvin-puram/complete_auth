/* eslint-disable no-undef */
describe('The Home Page', () => {
  it('should navigate to home and display page title', () => {
    cy.visit('/');

    cy.get('#home-page-title').should('contain', 'Fullstack Auth Application');
  });
});
