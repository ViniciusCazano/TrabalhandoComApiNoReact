import axio from './service'

/* Componentes responsaveis por efetuar as chamadas dos endpoints relacionados ao modulo de deputado  */

export function getDeputados(params){ /*Cria a chamada para a endpoint de listagem dos deputado */
    return axio.get('/deputados/', {params});
}
export function getDeputadoDetail(deputadoId){ /*Cria a chamada para a endpoint de exibição de um deputado selecionado*/
    return axio.get('/deputados/'+deputadoId);
}


