import React, { useState, useEffect } from 'react';
import './DataTable.css'
import { Paper, TextField, IconButton, Typography, Select, MenuItem, Grid, InputLabel, Snackbar } from '@material-ui/core';
import { Link } from '@material-ui/core';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Search, Visibility, Sort } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { Alert } from '../componentesAuxiliares/snackBarAlert'

function DataTable({ getData, coluns, match }) {
    let table = [] //Cria a variavel responsavel por retornar a tabela
    const [data, setData] = useState([]); //Recebe os dados da busca feita pela endpoint
    const [page, setPage] = useState(1); //Controla a paginação
    const [qtdMaxPage, setQtdMaxPage] = useState(5); // Controla a quantidade de itens a serem exibidos
    const [lastPage, setLastPage] = useState(1);
    const [params, setParams] = useState({ pagina: page, itens: qtdMaxPage, ordenarPor:"nome", ordem:"ASC"});
    
    const [open, setOpen] = useState(false);//Controla o componente que exibe a quantidade de itens exibidos
    const [loading, setLoading] = useState(false);//Controla o estado da pagina, **se esta carregado
    const [reloading, setReloading] = useState(false);//Controla a requição de busca, se deve ser carregada ou nao

    const [abreSnackBar, setAbreSnackBar] = useState(false);//Controla o componente que exibe o erro na tela
    const [mensagemDeErro, setMensagemDeErro] = useState(false);//Armazena a causa do erro na tela
    const [fecharTela, setFecharTela] = useState(false);//Responsavel por retornar do modulo de deputado para a tela inicial caso der erro

    
    useEffect(() => { ///Responsavel por efetuar a chamada as endpoints a cada reloading
        async function fetch() {
            try {
                setLoading(true);//Muda o estado da tela para exibir tela de carregamento
                Promise.all([//Faz a chamada da endpoint
                    await getData(params) 
                ]).then(values => {
                    /*Seta as variaveis data com o retorno da endpoint  */
                    if (values[0].data.dados !== []) {
                        setData((values[0].data.dados));//Variavel data com os valores de cada deputado
                        /*Seta a variavel que exibe o numero da ultima pagina */
                        (values[0].data.links
                            .map(item => {
                                if (item.rel == 'last')
                                    setLastPage(item.href.split("pagina=")[1].split("&")[0])
                            }
                            )
                        )
                    }
                })
                setLoading(false); //Muda o estado da tela para exibir a tabela
            } catch (error) {
                //Caso ocorra algum erro, abre a caixa de dialogo e seta uma mensagem
                setAbreSnackBar(true);
                setMensagemDeErro(error.response.data.detail);
            };
        };
        fetch();
    }, [reloading]);

    const handleChangePage = (event, value) => {
        //Responsavel por controlar a paginação
        setPage(value);
        setParams({ ...params, pagina: value })
        setReloading(!reloading);
    };
    const handleChangeQtdView = (event) => {
        //Responsavel por controlar a quantidade de itens a serem exibidos
        setQtdMaxPage(event.target.value);
        setParams({ ...params, itens: event.target.value })
        setReloading(!reloading);
    };

    const onChange = (e) => {
        //Responsavel por controlar a pesquisa dos campos
        if (e.target.value!=="")
            setParams({ ...params, [e.target.id]: e.target.value })
        else
            delete params[e.target.id] 
    }
    const onClickOrder = (e) => {
        //Responsavel por controlar a ordenação dos campos
        if (params.ordem=="ASC" && params.ordenarPor===e.currentTarget.id)
            setParams({ ...params, ordenarPor: e.currentTarget.id, ordem:"DESC" }); 
        else
            setParams({ ...params, ordenarPor: e.currentTarget.id, ordem:"ASC" });
            setReloading(!reloading)
    }

    table.push(<tr> {/*Cria a primeira linha da tabela, cabeçalho */}
        {
            coluns.forEach(element => {
                table.push(<th> {/*Cria as colunas com o cabeçalho especificado na variavel coluns */}
                    {
                        (element.type === "text") ? //Caso a coluna nao tenha parametro de pesquisa
                            element.label
                        ://Caso a coluna tenha parametro de pesquisa
                            (
                                <Paper component="form">{/*Cria um container para exibir, o campo de texto e oo botoes de pesquisa e de ordenaçao */}
                                    <TextField /*Campo de texto */
                                        id={element.name} 
                                        label={element.label} 
                                        onChange={onChange}
                                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(setReloading(!reloading)); }}
                                        
                                    />
                                    <IconButton /*botao de pesquisa */
                                        type="button" 
                                        aria-label="search" 
                                        onClick={e => setReloading(!reloading)}
                                    >
                                        <Search /> 
                                    </IconButton>
                                    <IconButton /*botao de ordenação */
                                        type="button" 
                                        aria-label="search" 
                                        id={element.name} 
                                        onClick={onClickOrder}
                                    >
                                        <Sort />
                                    </IconButton>
                                </Paper>
                            )


                    }
                </th>)
            })
        }
    </tr>)

    data.forEach(element => { /*Insere cada deputado em um linha na tabela */
        table.push(<tr>
            {coluns.forEach(elementColun => {//exibe cada coluna da tabela
                table.push(<td>
                    {
                        (elementColun.label === "Visualizar") ?//Fazer o botao de visualização, linkando com o redirecionamento de exibição
                            (
                                <Link component={RouterLink} to={`${match.url}/${elementColun.posicao(element)}`}>
                                    <IconButton type="submit" aria-label="Visualizar">
                                        <Visibility />
                                    </IconButton>
                                </Link>
                            )
                        ://se nao for visualização adiciona o elemento na coluna pertencente
                            elementColun.posicao(element)
                    }
                </td>)
            })}
        </tr>)
    });


    if (abreSnackBar) {//Fazer o carregamento apenas da mensagem de erro na tela e fechar em 30segundos
        return (
            <Snackbar open={abreSnackBar} autoHideDuration={3000} onClose={e => { setAbreSnackBar(false); setFecharTela(true); }}>
                <Alert onClose={e => { setAbreSnackBar(false); setFecharTela(true); }} severity="error">{mensagemDeErro}</Alert>
            </Snackbar>
        );
    };
    if (fecharTela)//Fazer o redirecionamento a tela inicial ao fechar a mensagem de erro
        return <Redirect to={'/'} />

    return (
        (loading)?//Exiba carregando ate terminar de carregar os dados
            <div><h1>Carregando</h1></div>
        ://Exibir a tabela quando carregado os dados
            <div>
                <table>{table}</table> {/*Exibe a variavel responsavel por criar a tabela */}
                <Grid container> {/*Bloco que contem a paginação */}
                    <Grid item xs={6} sm={6} md={3} lg={3}>{/*Exibe a pagina atual */}
                        <Typography>Pagina: {page}</Typography>
                    </Grid >
                    
                    <Grid item xs={6} sm={6} md={3} lg={3}>{/*Exibe o controle de itens a verificar por pagina */}
                        <InputLabel id="demo-controlled-open-select-label">Visualizar</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={open}
                            onClose={e=>setOpen(false)}
                            onOpen={e=>setOpen(true)}
                            value={qtdMaxPage}
                            onChange={handleChangeQtdView}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                        </Select>
                    </Grid>
                    
                    <Grid item xs={6} sm={6} md={3} lg={3}> {/*Exibe a paginação */}
                        <Pagination count={lastPage} page={page} onChange={handleChangePage} />
                    </Grid>
                </Grid>
            </div>
    );
}

export default DataTable;