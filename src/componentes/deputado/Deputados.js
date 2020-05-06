import React from 'react';
import DataTable from '../dataTable/DataTable'
import {getDeputados} from '../../services/deputadoServices'

function DeputadoListagem({ match }) {
    /* Cria as colunas desejadas para listagem, que servira como parametro para o componente DataTable */
    const coluns = [
        {
            name: "visualizar",
            type: "text",
            label: "Visualizar",
            posicao: deputado => deputado.id
        },
        {
            name: "nome",
            type: "input",
            label: "Nome",
            posicao: deputado => deputado.nome
        },
        {
            name: "siglaPartido",
            type: "input",
            label: "Sigla do partido",
            posicao: deputado => deputado.siglaPartido
        },
        {
            name: "email",
            type: "text",
            label: "Email",
            posicao: deputado => deputado.email
        }
    ]

    return (
        <div className="App">
            <center>
                <h1>Listagem de deputados</h1>
                
                <DataTable
                    getData={getDeputados} /* Passa a url responsavel pela requisição de busca */
                    coluns={coluns} /* Passa as colunas que seram apresentadas */
                    match={match} /* Passa parametros adicionais da tela */
                />
            </center>

        </div>
    );
}

export default DeputadoListagem;