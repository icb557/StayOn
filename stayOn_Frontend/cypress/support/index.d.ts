// ensure this file is included via tsconfig.json "types" or "include"
export {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in via UI or API.
       * @example cy.login('user@mail.com', 'Passw0rd!')
       */
      login(email: string, password: string): Chainable<void>
    }
  }
}
