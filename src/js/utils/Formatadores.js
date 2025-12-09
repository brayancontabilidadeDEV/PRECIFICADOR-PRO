export class Formatadores {
    static formatarMoeda(valor, moeda = 'BRL', locale = 'pt-BR') {
        if (valor === null || valor === undefined || isNaN(valor)) {
            return 'R$ 0,00';
        }
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: moeda,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    }

    static formatarPercentual(valor, casasDecimais = 2) {
        if (valor === null || valor === undefined || isNaN(valor)) {
            return '0%';
        }
        
        return valor.toFixed(casasDecimais) + '%';
    }

    static formatarNumero(valor, casasDecimais = 2) {
        if (valor === null || valor === undefined || isNaN(valor)) {
            return '0,00';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        }).format(valor);
    }

    static formatarData(data, incluirHora = false) {
        if (!data) return '';
        
        const dataObj = new Date(data);
        
        if (incluirHora) {
            return dataObj.toLocaleDateString('pt-BR') + ' ' + 
                   dataObj.toLocaleTimeString('pt-BR');
        }
        
        return dataObj.toLocaleDateString('pt-BR');
    }

    static formatarHora(data) {
        if (!data) return '';
        
        const dataObj = new Date(data);
        return dataObj.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    static formatarBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static formatarCPF(cpf) {
        if (!cpf) return '';
        
        cpf = cpf.replace(/\D/g, '');
        
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatarCNPJ(cnpj) {
        if (!cnpj) return '';
        
        cnpj = cnpj.replace(/\D/g, '');
        
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    static formatarTelefone(telefone) {
        if (!telefone) return '';
        
        telefone = telefone.replace(/\D/g, '');
        
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return telefone;
    }

    static formatarCEP(cep) {
        if (!cep) return '';
        
        cep = cep.replace(/\D/g, '');
        
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    static formatarPlaca(placa) {
        if (!placa) return '';
        
        placa = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (placa.length === 7) {
            return placa.replace(/([A-Z]{3})(\d{4})/, '$1-$2');
        }
        
        return placa;
    }

    static formatarCartaoCredito(numero) {
        if (!numero) return '';
        
        numero = numero.replace(/\D/g, '');
        
        return numero.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
    }

    static formatarDataExtenso(data) {
        if (!data) return '';
        
        const dataObj = new Date(data);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return dataObj.toLocaleDateString('pt-BR', options);
    }

    static formatarTempoDecorrido(data) {
        if (!data) return '';
        
        const agora = new Date();
        const dataObj = new Date(data);
        const diferenca = agora - dataObj;
        
        const segundos = Math.floor(diferenca / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
        
        if (dias > 0) {
            return `${dias} ${dias === 1 ? 'dia' : 'dias'} atrás`;
        } else if (horas > 0) {
            return `${horas} ${horas === 1 ? 'hora' : 'horas'} atrás`;
        } else if (minutos > 0) {
            return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} atrás`;
        } else {
            return 'agora mesmo';
        }
    }

    static formatarIntervalo(inicio, fim) {
        if (!inicio || !fim) return '';
        
        const inicioObj = new Date(inicio);
        const fimObj = new Date(fim);
        
        const dataFormatada = inicioObj.toLocaleDateString('pt-BR');
        const horaInicio = inicioObj.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const horaFim = fimObj.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `${dataFormatada} ${horaInicio} - ${horaFim}`;
    }

    static formatarDuracao(segundos) {
        if (!segundos || segundos <= 0) return '0s';
        
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = Math.floor(segundos % 60);
        
        const partes = [];
        
        if (horas > 0) partes.push(`${horas}h`);
        if (minutos > 0) partes.push(`${minutos}m`);
        if (segs > 0 || partes.length === 0) partes.push(`${segs}s`);
        
        return partes.join(' ');
    }

    static formatarPorcentagemBarra(valor, total) {
        if (total === 0) return '0%';
        
        const porcentagem = (valor / total) * 100;
        return this.formatarPercentual(porcentagem);
    }

    static formatarListaItens(itens, separador = ', ', maxItens = 3) {
        if (!itens || !Array.isArray(itens) || itens.length === 0) {
            return '';
        }
        
        if (itens.length <= maxItens) {
            return itens.join(separador);
        }
        
        const primeiros = itens.slice(0, maxItens);
        const restante = itens.length - maxItens;
        
        return primeiros.join(separador) + ` e mais ${restante}`;
    }

    static formatarNomeProprio(nome) {
        if (!nome) return '';
        
        return nome.toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }

    static formatarIniciais(nome) {
        if (!nome) return '';
        
        return nome.split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase())
            .join('')
            .substring(0, 2);
    }

    static formatarNumeroOrdinal(numero) {
        if (!numero && numero !== 0) return '';
        
        const sufixos = ['º', 'º', 'º', 'º'];
        const v = numero % 100;
        
        return numero + (sufixos[(v - 20) % 10] || sufixos[v] || sufixos[0]);
    }
}
