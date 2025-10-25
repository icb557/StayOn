describe('login', () => {
  it('should login', () => {
    cy.login('isac_cortes82212@elpoli.edu.co', 'P@ssw0rd')
  })
  it('should not login with invalid credentials', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('input[name="email"]').type('isac_cortes82212@gmail.com')
    cy.get('input[name="password"]').type('P@ssw0rd')
    cy.get('button[type="submit"]').click()
    cy.get('button[type="submit"]').should('exist')
  })
})

describe('logout', () => {
  it('should logout', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('input[name="email"]').type('isac_cortes82212@elpoli.edu.co')
    cy.get('input[name="password"]').type('P@ssw0rd')
    cy.get('button[type="submit"]').click()
    cy.location('pathname').should('eq', '/')
    cy.get('button').contains('Cerrar sesión').click()
    cy.url().should('include', '/login')
  })
})