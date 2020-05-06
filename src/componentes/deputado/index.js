import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DeputadoListar from './Deputados'
import DeputadoDetail from './DeputadoDetails'

function RouterDeputado({ match }) {
    return (
        /*Redireciona o app para o componente desejado dentro do modulo de deputado*/
        <div>
            <Route exact path={`${match.path}`} component={DeputadoListar} />{/*Redireciona para a listagem de todos os deputados */}
            <Route exact path={`${match.path}/:id_deputado`} component={DeputadoDetail} /> {/*Redireciona para a exibição de um deputado em especifico */}
        </div>
    );
}

export default RouterDeputado;