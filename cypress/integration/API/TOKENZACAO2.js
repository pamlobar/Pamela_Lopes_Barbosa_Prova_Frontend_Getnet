
Client ID: 67823c6d-58de-494f-96d9-86a4c22682cb
Client Secret: c2d6a06f-5f31-448b-9079-7e170e8536e4

Basic token = 67823c6d-58de-494f-96d9-86a4c22682cb:c2d6a06f-5f31-448b-9079-7e170e8536e4
Basic token in Base64 = Njc4MjNjNmQtNThkZS00OTRmLTk2ZDktODZhNGMyMjY4MmNiOmMyZDZhMDZmLTVmMzEtNDQ4Yi05MDc5LTdlMTcwZTg1MzZlNA==


describe('Getnet API - Tokenization', () => {
  
    const authorizationToken = 'Njc4MjNjNmQtNThkZS00OTRmLTk2ZDktODZhNGMyMjY4MmNiOmMyZDZhMDZmLTVmMzEtNDQ4Yi05MDc5LTdlMTcwZTg1MzZlNA=='
    let accessToken = '';
  
    // Dados para tokenização
    const cardDataFull = {
      "card_number": "5155901222280001",
      "customer_id": "customer_21081826"
    };
  
    // Dados para tokenização nao encontrado
    const cardDataFull500 = {
      "card_number": "string"*10000,  // Um valor inválido para o número do cartão
      "customer_id": 123,  // Um valor inválido para o ID do cliente
    };
  
    // Enviar uma requisição com campos faltando
    const cardDataIncomplete = {
      customer_id: '12345'
    };
  
  
    before(() => {
      // Obter o token de autenticação
      cy.request({
        method: 'POST',
        url: 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token',
        form: true, // Envia como application/x-www-form-urlencoded
        headers: {
          Authorization: `Basic ${authorizationToken}`
        },
        body: {
          scope: 'oob',
          grant_type: 'client_credentials'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.scope).to.eq('oob');
        expect(response.body.expires_in).to.eq(3600);
        expect(response.body.token_type).to.eq('Bearer');
        accessToken = response.body.access_token;
      });
    });
  
    it('Requisicao valida', () => {
  
      // Solicitação de tokenização
      cy.request({
        method: 'POST',
        url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: cardDataFull
      }).then((response) => {
        // Validação de Status Code
        expect(response.status).to.eq(201);
  
        // Validação de campos obrigatórios e contrato
        expect(response.body).to.have.property('number_token');
      });
    });
  
    it('Requisicao invalida', () => {
      cy.request({
        method: 'POST',
        url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: cardDataIncomplete,
        failOnStatusCode: false // Não falhar no caso de status code de erro
      }).then((response) => {
        // Validar status code para erro de requisição
        expect(response.status).to.eq(400);
  
        // Validar mensagem de erro
        expect(response.body).to.have.property('message');
      });
    });
  
    it('Autenticacao invalida', () => {
      cy.request({
        method: 'POST',
        url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
        headers: {
          Authorization: `Bearer ${accessToken}123`
        },
        body: cardDataFull,
        failOnStatusCode: false // Não falhar no caso de status code de erro
      }).then((response) => {
        // Validar status code para erro de requisição
        expect(response.status).to.eq(401);
  
        // Validar mensagem de erro
        expect(response.body).to.have.property('message');
      });
    });
  
    it('Nao encontrado', () => {
      cy.request({
        method: 'POST',
        url: 'https://api-homologacao.getnet.com.br/v1/tokens/card/1',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: cardDataFull,
        failOnStatusCode: false // Não falhar no caso de status code de erro
      }).then((response) => {
        // Validar status code para erro de requisição
        expect(response.status).to.eq(404);
  
        // Validar mensagem de erro
        expect(response.body).to.have.property('message');
      });
    });
  
    
  
  });