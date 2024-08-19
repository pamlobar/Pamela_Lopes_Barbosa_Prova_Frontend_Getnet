describe('Tokenization API Test', () => {
    let authentToken;
    let accessToken = '';
    //Criação de constants com token de autenticação
    const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
    const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
        // Dados do cartão e do comprador válidos
        const requestBody = {
            card_number: '5155901222280001', 
            customer_id: 'customer_21081826'
        }; 
        // Dados do cartão e do comprador inválidos
            const cardDataFull = {
                card_number: '51559012333380001',  
                customer_id: '123'  
            };
        // Dados do cartão e do comprador não encontrado
            const cardDataFull2 = {
                card_number: '5155901222280001',  
                customer_id: 'customer_11081826'
            };
        // Enviar uma requisição com campos faltando
            const cardDataIncomplete = {
            customer_id: 'customer_21081826'
        };


    before(() => {
        // Gerar o token para acesso a autenticação
        const authentString = `${clientId}:${clientSecret}`;
        // Codificando para Base64
        const encodedAuthentString = Buffer.from(authentString).toString('base64'); 

        //POST para criar a chave do token de autenticação
        cy.request({
            method: 'POST',
            url: 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token',
            headers: {
                'Authorization': `Basic ${encodedAuthentString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                scope: 'oob',
                grant_type: 'client_credentials'
            }).toString()
        }).then((response) => {
            // Valida o status da resposta para token de autenticação
            expect(response.status).to.eq(200);
                       
            authentToken = response.body.access_token;
            cy.log(`Obtained Auth Token: ${authentToken}`);
        });
    });
    //POST de tokenticação
    it('Verificar se o token do cartão é válido para a autenticação', () => {
        

        // Valida os campos obrigatórios da requisição
        expect(requestBody).to.have.property('card_number').that.is.a('string').that.has.length.within(13, 19);
        expect(requestBody).to.have.property('customer_id').that.is.a('string').that.is.not.empty;

        cy.request({
            method: 'POST',
            url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
            headers: {
                'Authorization': `Bearer ${authentToken}`,
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: requestBody
        }).then((response) => {
            // Valida o status da resposta
            expect(response.status).to.eq(201);
            
            // Valida o contrato da API TOKENTICAÇÃO
            expect(response.body).to.have.property('number_token').that.is.a('string').that.is.not.empty;            
        });
    });

    it('Requisicao invalida', () => {
        cy.request({
          method: 'POST',
          url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
          headers: {
            Authorization: `Bearer ${authentToken}`
          },
          body: cardDataIncomplete,
          // Não falhar no caso de status 400
          failOnStatusCode: false 
        }).then((response) => {
          // Validar status code para erro de requisição
          expect(response.status).to.eq(400);
    
          // Valida o contrato da API TOKENTICAÇÃO
          expect(response.body).to.have.property('message');
        });
      });
    
      it('Autenticacao invalida', () => {
        cy.request({
          method: 'POST',
          url: 'https://api-homologacao.getnet.com.br/v1/tokens/card',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: cardDataFull,
          // Não falhar no caso de status 401
          failOnStatusCode: false 
        }).then((response) => {
          // Validar status code para erro de requisição
          expect(response.status).to.eq(401);
    
          // Valida o contrato da API TOKENTICAÇÃO
          expect(response.body).to.have.property('message');
        });
      });
    
      it('Nao encontrado', () => {
        cy.request({
          method: 'POST',
          url: 'https://api-homologacao.getnet.com.br/v1/tokens/card/1',
          headers: {
            Authorization: `Bearer ${authentToken}`
          },
          body: cardDataFull2,
          // Não falhar no caso de status 404
          failOnStatusCode: false 
        }).then((response) => {
          // Validar status code para erro de requisição
          expect(response.status).to.eq(404);
    
          // Valida o contrato da API TOKENTICAÇÃO
          expect(response.body).to.have.property('message');
        });
      });

});