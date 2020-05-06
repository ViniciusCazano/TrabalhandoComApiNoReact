import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

export function Alert(props) { //cria um alert para exibir as mensagens de erro
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}