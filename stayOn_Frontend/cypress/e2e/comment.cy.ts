describe('comments', () => {
  it('should comment a post', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('input[name="email"]').type('isac_cortes82212@elpoli.edu.co')
    cy.get('input[name="password"]').type('P@ssw0rd')
    cy.get('button[type="submit"]').click()
    cy.location('pathname').should('eq', '/')

    cy.get(':nth-child(2) > .post-footer > .comment-btn').click()
    cy.get('.comment-input').type('This is a test comment')
    cy.wait(1000)
    cy.get('.submit-btn').contains('Publicar comentario').click()
    cy.get('div').contains('This is a test comment').should('exist')
  })

  it('should edit comment on a post', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('input[name="email"]').type('isac_cortes82212@elpoli.edu.co')
    cy.get('input[name="password"]').type('P@ssw0rd')
    cy.get('button[type="submit"]').click()
    cy.location('pathname').should('eq', '/')

    cy.get(':nth-child(2) > .post-footer > .comment-btn').click()
    cy.get('.edit-btn').click()
    cy.get(':nth-child(3) > .form-group > .comment-input').type(' edited')

    cy.wait(1000)
    cy.get('.save-btn').click()
    cy.get('div').contains('This is a test comment edited').should('exist')
  })

  it('should delete comment on a post', () => {
    cy.visit('http://localhost:4200/login')
    cy.get('input[name="email"]').type('isac_cortes82212@elpoli.edu.co')
    cy.get('input[name="password"]').type('P@ssw0rd')
    cy.get('button[type="submit"]').click()
    cy.location('pathname').should('eq', '/')

    cy.get(':nth-child(2) > .post-footer > .comment-btn').click()
    cy.get('.delete-btn').click()
    cy.wait(1000)
    cy.get('.swal2-confirm').click()
    cy.get('div').contains('This is a test comment edited').should('not.exist')
  })
})