import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, TextField, MenuItem, Snackbar } from '@material-ui/core';
import moment from 'moment';
import { InputMaskCustomCPF } from '../componentesAuxiliares/mascaras'
import { Alert } from '../componentesAuxiliares/snackBarAlert'

import { getDeputadoDetail } from '../../services/deputadoServices'
import { getUFs, getMunicipios } from '../../services/service'
import './deputado.css'


function DeputadoDetail({ match }) {
    const deputadoId = match.params.id_deputado; //Contem o id passado na url
    const [data, setData] = useState([]);//Contem os dados do deputado
    const [dataUfs, setDatasUfs] = useState([]);//Contem os dados dos estados
    const [dataMunicipios, setDataMunicipios] = useState([]);//Contem os dados dos municipios
    const [loading, setLoading] = useState(false);//Controla o estado da pagina, **se esta carregado

    const [abreSnackBar, setAbreSnackBar] = useState(false);//Controla o componente que exibe o erro na tela
    const [mensagemDeErro, setMensagemDeErro] = useState(false);//Armazena a causa do erro na tela
    const [fecharTela, setFecharTela] = useState(false);//Responsavel por retornar do modulo de deputado para a tela inicial caso der erro


    useEffect(() => {
        async function fetch() {//Efetua as chamadas de api de busca do deputado, Listagem de Ufs e municipios
            try {
                setLoading(true);//Muda o estado da tela para carregando
                Promise.all([
                    await getDeputadoDetail(deputadoId),//Evetua a chamada na api passando o id da url
                    getUFs()//efetua chamada da api de estados
                ]).then(values => {
                    setData(values[0].data.dados);//salva os dados do deputado
                    setDatasUfs(values[1].data);//salva o retorno na variavel que ira criar os campos no select de estados

                    fetchMunicipio(values[1].data, values[0].data.dados);//Efetua a chamada da função que busca todos os municipios do estado
                });
                setLoading(false);//Muda o estado da tela para carregado
            } catch (error) {
                //Caso ocorra algum erro, abre a caixa de dialogo e seta uma mensagem
                setAbreSnackBar(true);
                setMensagemDeErro(error.response.data.detail);
            }

        };
        fetch(); //Chama a função que carregas os dados
    }, [deputadoId]);//Atualiza a cada troca de id na url
    
    function fetchMunicipio(ufData, muniData) {//Função que chama a api de listagem de municipios
        try {
            let id = 0; //Variavel que contera o id do estado
            ufData.forEach(element => {//procura o estado selecionado no campo, e recupera seu id
                if (element.sigla === muniData.ufNascimento)
                    id = element.id;
            });
            Promise.all([
                getMunicipios(id)//efetua a chamada da api de municipios
            ]).then(values => {
                setDataMunicipios(values[0].data); //salva o retorno na variavel que ira criar os campos no select de municipios
            });
        } catch (error) {
            //Caso ocorra algum erro, abre a caixa de dialogo e seta uma mensagem
            setAbreSnackBar(true);
            setMensagemDeErro(error.response.data.detail)
        }

    };

    function handleChange(e){//Nao faz nada caso o usuario tente alterar
        //setData({ ...data, [e.target.name]: e.target.value })
    }

    if (abreSnackBar) {//Fazer o carregamento apenas da mensagem de erro na tela e fechar em 30segundos
        return (
            <Snackbar open={abreSnackBar} autoHideDuration={3000} onClose={e => { setAbreSnackBar(false); setFecharTela(true); }}>
                <Alert onClose={e => { setAbreSnackBar(false); setFecharTela(true); }} severity="error">{mensagemDeErro}</Alert>
            </Snackbar>
        );
    };
    if (fecharTela)//Fazer o redirecionamento a tela inicial ao fechar a mensagem de erro
        return <Redirect to={'/deputado'} />

    return (
        (loading) ? //Exibe tela de carregamento
            <div>
                <h1>Carregando</h1>
            </div>
        ://Exibe tela com os dados do deputado, em seu campo respectivo
            <div className="App">
                <Grid container spacing={5}> {/*Nome eleitoral, Foto */}
                    <Grid item xs={24} sm={12} md={8} lg={6} > {/*Nome*/}
                        {
                            (data.sexo && data.sexo==='M')?
                                <h1>Deputado {data.ultimoStatus && data.ultimoStatus.nomeEleitoral}</h1>
                            :
                                <h1>Deputada {data.ultimoStatus && data.ultimoStatus.nomeEleitoral}</h1>
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >{/*Foto*/}
                        <img
                            className="imgCss"
                            src={data.ultimoStatus && data.ultimoStatus.urlFoto}
                            alt="new"
                        />
                    </Grid>
                </Grid>

                <h2>Dados Basicos:</h2>
                <Grid container spacing={5}>{/*Nome Civil, CPF, Sexo */}
                    <Grid item xs={12} sm={6} md={4} lg={3} > {/*Nome civil */}
                        <TextField
                            className="textFieldCss"
                            name="nomeCivil"
                            label="Nome civil"
                            value={data.nomeCivil || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*CPF */}
                        <TextField
                            className="textFieldCss"
                            name="cpf"
                            label="CPF"
                            InputProps={{ inputComponent: InputMaskCustomCPF }} //cria mascara para o campo
                            value={data.cpf || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Sexo */}
                        <TextField
                            className="textFieldCss"
                            name="sexo"
                            label="Sexo"
                            value={data.sexo || ''}
                            variant="outlined"
                            select
                            onChange={handleChange}
                        >
                            <MenuItem value=""> </MenuItem>
                            <MenuItem value="F">Feminino</MenuItem>
                            <MenuItem value="M">Masculino</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Grid container spacing={5}> {/*Data de nascimento, Data de falecimento, Escolaridade */}
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Data de nascimento*/}
                        <TextField
                            className="textFieldCss"
                            name="dataNascimento"
                            label="Data de nascimento"
                            value={(data.dataNascimento && moment(data.dataNascimento).format("DD/MM/YYYY")) || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Data de falecimento*/}
                        <TextField
                            className="textFieldCss"
                            name="dataFalecimento"
                            label="Data de falecimento"
                            value={(data.dataFalecimento && moment(data.dataFalecimento).format("DD/MM/YYYY")) || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/* Escolaridade */}
                        <TextField
                            className="textFieldCss"
                            name="escolaridade"
                            label="Escolaridade"
                            value={data.escolaridade || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={5}> {/*Distrito de nascimento, municipio de nascimento */}
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/* Distrito de nascimento */}
                        <TextField
                            className="textFieldCss"
                            name="ufNascimento"
                            label="Distrito de nascimento"
                            value={data.ufNascimento || ''}
                            variant="outlined"
                            select
                            onChange={handleChange}
                        >
                            {//Cria um menu de contendo todos os estados trazidos da api
                                dataUfs.map(element =>
                                    <MenuItem value={String(element.sigla)}> {String(element.nome)} </MenuItem>
                                )
                            }
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/* municipio de nascimento */}
                        <TextField
                            className="textFieldCss"
                            name="municipioNascimento"
                            label="Municipio de nascimento"
                            value={data.municipioNascimento || ''}
                            variant="outlined"
                            select
                            onChange={handleChange}
                        >
                            {//Cria um menu de contendo todos os municipios trazidos da api
                                dataMunicipios.map(element =>
                                    <MenuItem value={String(element.nome)}> {String(element.nome)} </MenuItem>
                                )
                            }
                        </TextField>
                    </Grid>
                </Grid>

                <h3>Dados da campanha:</h3>
                <Grid container spacing={3}>{/*Sigal do partido, Email */}
                    <Grid item xs={12} sm={12} md={6} lg={6} > {/*Email */}
                        <TextField
                            className="textFieldCss"
                            name="email"
                            label="Email"
                            value={data.ultimoStatus && data.ultimoStatus.email || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Sigla do partido */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.siglaPartido"
                            label="Sigla do partido"
                            value={data.ultimoStatus && data.ultimoStatus.siglaPartido || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>{/*Situacao, Condição eleitoral, Descrição de status  */}
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Situacao */}
                        <TextField
                            className="textFieldCss"
                            name="situacao"
                            label="Situação"
                            value={data.ultimoStatus && data.ultimoStatus.situacao || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Condição eleitoral */}
                        <TextField
                            className="textFieldCss"
                            name="condicaoEleitoral"
                            label="Condição eleitoral"
                            value={data.ultimoStatus && data.ultimoStatus.condicaoEleitoral || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Descrição de status */}
                        <TextField
                            className="textFieldCss"
                            name="descricaoStatus"
                            label="Descrição de status"
                            value={data.ultimoStatus && data.ultimoStatus.descricaoStatus || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <h3>Dados do gabinete:</h3>
                <Grid container spacing={3}>{/*Nome do gabinete, email do gabinete, telefone do gabinete*/}
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Nome do gabinete */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.gabinete.nome"
                            label="Nome"
                            value={data.ultimoStatus && 
                                data.ultimoStatus.gabinete && 
                                data.ultimoStatus.gabinete.nome || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*telefone do gabinete */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.gabinete.telefone"
                            label="Telefone"
                            value={data.ultimoStatus && 
                                data.ultimoStatus.gabinete && 
                                data.ultimoStatus.gabinete.telefone || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>{/*Predio, Andar, Sala*/}
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Nome do gabinete */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.gabinete.predio"
                            label="Predio"
                            value={data.ultimoStatus && 
                                data.ultimoStatus.gabinete && 
                                data.ultimoStatus.gabinete.predio || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Andar */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.gabinete.andar"
                            label="Andar"
                            value={data.ultimoStatus && 
                                data.ultimoStatus.gabinete && 
                                data.ultimoStatus.gabinete.andar || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} md={3} lg={3} > {/*Sala */}
                        <TextField
                            className="textFieldCss"
                            name="ultimoStatus.gabinete.sala"
                            label="Sala"
                            value={data.ultimoStatus && 
                                data.ultimoStatus.gabinete && 
                                data.ultimoStatus.gabinete.sala || ''}
                            variant="outlined"
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

            </div>
    );
}

export default DeputadoDetail;