describe('Tokenization API Test', () => {
    let authentToken;
    //Criação de constants com token de autenticação
    const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
    const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';

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
        // Dados do cartão e do comprador
        const requestBody = {
            card_number: '5155901222280001', 
            customer_id: 'customer_21081826' 
        };
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
            cy.log(`Response Body: ${JSON.stringify(response.body)}`);
        });
    });
});