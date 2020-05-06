import React, { useState } from 'react';
import './menu.css';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import { Button, TextField, IconButton } from '@material-ui/core';
import { Search} from '@material-ui/icons';

function Menu({ match }) {
    const [deputadoId, setDeputadoId] = useState(null);
    return (//cria um menu, que redireciona para tela inicial, deputados e pesquisa um id de deputado
        <div className="divMenuCss">
            <Link className="linkCss" component={RouterLink} to={`/`}>{/*Tela inicial */}
                <Button color="primary">
                    Inicio
                </Button>
            </Link>

            <Link className="linkCss" component={RouterLink} to={`/deputado`}> {/*Tela de deputado */}
                <Button color="primary">
                    Deputados
                </Button>
            </Link>

            <TextField id="filled-basic" label="Pesquisar deputado" variant="filled" value={deputadoId} onChange={ e=>setDeputadoId(e.target.value.replace(/[^\d\s-/]/g, "")) } />{/*Campo responsavel por capturar o id */}
            <Link className="linkCss" component={RouterLink} to={`/deputado/${deputadoId}`}> {/*Tela de exibiçaõ do deputado selecionado */}
                <IconButton type="button" aria-label="search" onClick={e=>setDeputadoId('')}>
                    <Search />
                </IconButton>
            </Link>

        </div>
    );
}

export default Menu;