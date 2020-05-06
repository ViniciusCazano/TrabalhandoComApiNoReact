import axios from 'axios';
/* Configurações para chamada de serviços internos */
const PORT_URL='https://dadosabertos.camara.leg.br/api/v2/'
axios.defaults.baseURL = PORT_URL;

export default{ /*Exporta objetos axios ja configurados referentes ao tipo de requisição desejado */
    'get':axios.get,
};

/* Chamada de serviços externos */
export function getUFs(){ /*Cria a chamada para a endpoint de listagem de todos os estados */
    return axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/');
}
export function getMunicipios(municipioUf){ /*Cria a endpoint de listagem de todos os municipios de um estado selecionado */
    return axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${municipioUf}/municipios`);
}
