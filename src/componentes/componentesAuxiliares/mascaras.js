import React from 'react';
import MaskedInput from "react-text-mask";

export function InputMaskCustomCPF(props) {
    /*Cria uma mascara de CPF para campo de texto */
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={(rawValue) => {
                return [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-',  /[0-9]/, /[0-9]/]
            }}
            guide={false}
        />
    );
}