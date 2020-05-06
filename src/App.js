import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RouterDeputados from './componentes/deputado'
import TelaInicial from './componentes/telaInicial'
import Menu from './componentes/mainDrawer/menu'

function App() {
  return (
    /*Redireciona o app com relação a URL*/
    <Router>
      <Menu/>
      <Switch>
        <Route exact path="/" component={TelaInicial} /> {/*Redireciona para o componente da tela inicial */}
        <Route path="/deputado" component={RouterDeputados} /> {/*Redireciona para a lista de rotas do modulo de deputados */}
      </Switch>
    </Router>
  );
}

export default App;
