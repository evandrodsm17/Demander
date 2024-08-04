function realParaRomano(num) {
    const algarismosRomanos = [
        { value: 1000000, simbolo: '_M' },
        { value: 900000, simbolo: '_CM' },
        { value: 500000, simbolo: '_D' },
        { value: 400000, simbolo: '_CD' },
        { value: 100000, simbolo: '_C' },
        { value: 90000, simbolo: '_XC' },
        { value: 50000, simbolo: '_L' },
        { value: 40000, simbolo: '_XL' },
        { value: 10000, simbolo: '_X' },
        { value: 9000, simbolo: '_IX' },
        { value: 5000, simbolo: '_V' },
        { value: 4000, simbolo: '_IV' },
        { value: 1000, simbolo: 'M' },
        { value: 900, simbolo: 'CM' },
        { value: 500, simbolo: 'D' },
        { value: 400, simbolo: 'CD' },
        { value: 100, simbolo: 'C' },
        { value: 90, simbolo: 'XC' },
        { value: 50, simbolo: 'L' },
        { value: 40, simbolo: 'XL' },
        { value: 10, simbolo: 'X' },
        { value: 9, simbolo: 'IX' },
        { value: 5, simbolo: 'V' },
        { value: 4, simbolo: 'IV' },
        { value: 1, simbolo: 'I' }
    ];

    let resultado = '';
    for (const item of algarismosRomanos) {
        while (num >= item.value) {
            resultado += item.simbolo;
            num -= item.value;
        }
    }
    return resultado;
}

function romanoParaReal(str) {
    const algarismosRomanos = {
        '_M': 1000000,
        '_CM': 900000,
        '_D': 500000,
        '_CD': 400000,
        '_C': 100000,
        '_XC': 90000,
        '_L': 50000,
        '_XL': 40000,
        '_X': 10000,
        '_IX': 9000,
        '_V': 5000,
        '_IV': 4000,
        'M': 1000,
        'CM': 900,
        'D': 500,
        'CD': 400,
        'C': 100,
        'XC': 90,
        'L': 50,
        'XL': 40,
        'X': 10,
        'IX': 9,
        'V': 5,
        'IV': 4,
        'I': 1
    };

    let resultado = 0;
    let i = 0;
    while (i < str.length) {
        let simboloAtual = str[i];
        let proximoSimbolo = str[i + 1];

        // Verifica símbolos compostos de dois caracteres
        if (i < str.length - 1 && algarismosRomanos[simboloAtual + proximoSimbolo]) {
            resultado += algarismosRomanos[simboloAtual + proximoSimbolo];
            i += 2;
        } else {
            resultado += algarismosRomanos[simboloAtual];
            i++;
        }
    }
    return resultado;
}

document.getElementById('convertForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tipoConversao = document.getElementById('tipoConversao').value;
    const Valor = document.getElementById('Valor').value;
    let resultado = '';

    if (tipoConversao === 'ParaRomano') {
        const number = parseInt(Valor);
        resultado = realParaRomano(number);
    } else if (tipoConversao === 'ParaReal') {
        resultado = romanoParaReal(Valor);
    }

    if((tipoConversao === 'ParaReal' && isNaN(resultado)) || (tipoConversao === 'ParaRomano' && resultado === '')){
        alert("A Operação retornou um resultado inválido! reveja seus parâmetros e tente novamente.")
        const inputValor = document.getElementById('Valor')
        inputValor.value = '';
    }else{
        document.getElementById('resultado').textContent = resultado;
    }

});