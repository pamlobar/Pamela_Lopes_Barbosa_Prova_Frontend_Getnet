// untitled.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/// <reference types="Cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
describe('Testes das opções da Central de Ajuda', () => {
//Teste para verificar a existencia da Central de Ajuda >> Eu concluí a negociação, de que forma receberei meu boleto?
    it('Central de ajuda - Eu concluí a negociação, de que forma receberei meu boleto?', () => {
//Acessando a área do cliente
      cy.visit('https://site.getnet.com.br/ ')
      cy.get('.gnt-navbar-buttons')
        .should('exist')
        .should('be.visible')
        .click()
      cy.contains('#menu-header-login > :nth-child(1) > .gnt-nav-button', 'Sou cliente')
        .should('exist')
        .should('be.visible')
        .click()
//Verificando a existencia da Central de Ajuda        
      cy.contains('.active > .gnt-nav-menu-depth2 > :nth-child(1) > .gnt-nav-menu > :nth-child(5) > #menu-ajuda-sou-cliente-central-ajuda', 'Central de ajuda')
        .should('exist')
        .should('be.visible')
        .click()
//Pesquisando pela palavra chave "boleto" e selecionando a opção "Eu concluí a negociação, de que forma receberei meu boleto?"        
      cy.get('#faq-search-input').type('boleto')
      cy.contains('[href="https://site.getnet.com.br/duvidas/solucao-de-dividas/?modal_open=692"] > .c-search-dropdown-link__item', 'Eu concluí a negociação, de que forma receberei meu boleto?')
        .click()
//Verificando se o texto informado condiz com a opção selecionada      
      cy.contains('Eu concluí a negociação, de que forma receberei meu boleto?')
        .should('be.visible')
      cy.contains('Portal do Cliente')
        .should('be.visible')
      cy.contains('1. Acesse: www.santandergetnet.com.br 2. Preencha seu login e senha para acessar a área restrita do Portal 3. No menu à esquerda, clique em Solução de Dívidas; 4. Na tela Títulos, selecione Abertos; 5. Na tela Negociação, você poderá simular a negociação e enviar uma contraproposta ou então concluir.')
        .should('be.visible')
      cy.contains('Portal Recargas')
        .should('be.visible')
      cy.contains('1. Acesse: http://portal.getnet-tecnologia.com.br; 2. Preencha seu login e senha para acessar a área restrita do Portal; 3. No menu à esquerda, clique em Menu Telefonia; 4. Clique em Financeiro e na sequência, em Soluções de Dívidas; 5. Na tela Títulos, selecione Abertos; 6. Na tela Negociação, você poderá simular a negociação e enviar uma contraproposta ou então concluir.')
        .should('be.visible')
//Fechando a modal de central de ajuda e retornando para a tela que consta as demais dúvidas      
        cy.get('.is-modal-open > .o-modal__content > .o-modal__close')
        .invoke('removeAttr', 'target')
        .click()
      cy.get('.c-modules-title').should('be.visible')
    }) 
   })
  