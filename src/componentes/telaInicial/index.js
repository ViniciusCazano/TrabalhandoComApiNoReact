import React from 'react';

function DeputadoListagem() {
    return (
        <div className="App">
            <center>
                <h1>Tela inicial</h1>
            </center>
            <p>
                Este projeto, faz requisições a api dos dados abertos da Câmara dos Deputados.
            </p>
            <p>
                Feito por: Vinicius H. Cazano
            </p>
            <h1>Explicando o sistema</h1>
            <p>
                Ao clicar no "Deputado", o mesmo redirecionara para a listagem de todos os deputado.
            </p>
            <p>
                Ao entrar nessa tela, é possivel filtrar e ordenar por nome e sigla do partido. Tambem é possivel
                pressionar o icone na coluna de visualização, 
                que ira redirecionar para a tela onde exibira os dados do deputado selecionado na tabela.
            </p>

            <p>
                Ao digitar um ID no campo de texto do menu e apertar no botao de pesquisa, o mesmo ira redirecionar para
                tela onde exibira os dados do deputado pesquisado.
            </p>
        </div>
    );
}

export default DeputadoListagem;