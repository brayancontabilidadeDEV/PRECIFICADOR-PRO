export class Validadores {
    static validarEmail(email) {
        if (!email) return { valido: false, erro: 'E-mail é obrigatório' };
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valido: regex.test(email),
            erro: regex.test(email) ? '' : 'E-mail inválido'
        };
    }

    static validarCPF(cpf) {
        if (!cpf) return { valido: false, erro: 'CPF é obrigatório' };
        
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) {
            return { valido: false, erro: 'CPF deve ter 11 dígitos' };
        }
        
        // Validação de CPF (algoritmo)
        let soma = 0;
        let resto;
        
        if (/^(\d)\1+$/.test(cpf)) {
            return { valido: false, erro: 'CPF inválido' };
        }
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) {
            return { valido: false, erro: 'CPF inválido' };
        }
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) {
            return { valido: false, erro: 'CPF inválido' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarCNPJ(cnpj) {
        if (!cnpj) return { valido: false, erro: 'CNPJ é obrigatório' };
        
        cnpj = cnpj.replace(/\D/g, '');
        
        if (cnpj.length !== 14) {
            return { valido: false, erro: 'CNPJ deve ter 14 dígitos' };
        }
        
        // Validação de CNPJ (algoritmo)
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0))) {
            return { valido: false, erro: 'CNPJ inválido' };
        }
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(1))) {
            return { valido: false, erro: 'CNPJ inválido' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarTelefone(telefone) {
        if (!telefone) return { valido: false, erro: 'Telefone é obrigatório' };
        
        const telefoneLimpo = telefone.replace(/\D/g, '');
        
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            return { valido: false, erro: 'Telefone inválido' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarCEP(cep) {
        if (!cep) return { valido: false, erro: 'CEP é obrigatório' };
        
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            return { valido: false, erro: 'CEP inválido' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarData(data) {
        if (!data) return { valido: false, erro: 'Data é obrigatória' };
        
        const dataObj = new Date(data);
        
        if (isNaN(dataObj.getTime())) {
            return { valido: false, erro: 'Data inválida' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarDataFutura(data) {
        const validacao = this.validarData(data);
        if (!validacao.valido) return validacao;
        
        const dataObj = new Date(data);
        const hoje = new Date();
        
        if (dataObj <= hoje) {
            return { valido: false, erro: 'Data deve ser futura' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarDataPassada(data) {
        const validacao = this.validarData(data);
        if (!validacao.valido) return validacao;
        
        const dataObj = new Date(data);
        const hoje = new Date();
        
        if (dataObj >= hoje) {
            return { valido: false, erro: 'Data deve ser passada' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarDataNascimento(data) {
        const validacao = this.validarData(data);
        if (!validacao.valido) return validacao;
        
        const dataObj = new Date(data);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataObj.getFullYear();
        
        if (idade < 0 || idade > 150) {
            return { valido: false, erro: 'Data de nascimento inválida' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarSenha(senha) {
        if (!senha) return { valido: false, erro: 'Senha é obrigatória' };
        
        if (senha.length < 8) {
            return { valido: false, erro: 'Senha deve ter no mínimo 8 caracteres' };
        }
        
        if (!/[A-Z]/.test(senha)) {
            return { valido: false, erro: 'Senha deve conter pelo menos uma letra maiúscula' };
        }
        
        if (!/[a-z]/.test(senha)) {
            return { valido: false, erro: 'Senha deve conter pelo menos uma letra minúscula' };
        }
        
        if (!/\d/.test(senha)) {
            return { valido: false, erro: 'Senha deve conter pelo menos um número' };
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
            return { valido: false, erro: 'Senha deve conter pelo menos um caractere especial' };
        }
        
        return { valido: true, erro: '' };
    }

    static validarURL(url) {
        if (!url) return { valido: false, erro: 'URL é obrigatória' };
        
        try {
            new URL(url);
            return { valido: true, erro: '' };
        } catch {
            return { valido: false, erro: 'URL inválida' };
        }
    }

    static validarNumero(numero, min = null, max = null) {
        if (numero === null || numero === undefined || numero === '') {
            return { valido: false, erro: 'Número é obrigatório' };
        }
        
        const num = parseFloat(numero);
        
        if (isNaN(num)) {
            return { valido: false, erro: 'Valor numérico inválido' };
        }
        
        if (min !== null && num < min) {
            return { valido: false, erro: `Valor mínimo é ${min}` };
        }
        
        if (max !== null && num > max) {
            return { valido: false, erro: `Valor máximo é ${max}` };
        }
        
        return { valido: true, erro: '' };
    }

    static validarTexto(texto, minLength = null, maxLength = null) {
        if (!texto && texto !== '') {
            return { valido: false, erro: 'Texto é obrigatório' };
        }
        
        const str = String(texto);
        
        if (minLength !== null && str.length < minLength) {
            return { valido: false, erro: `Mínimo de ${minLength} caracteres` };
        }
        
        if (maxLength !== null && str.length > maxLength) {
            return { valido: false, erro: `Máximo de ${maxLength} caracteres` };
        }
        
        return { valido: true, erro: '' };
    }

    static validarLista(lista, minItens = null, maxItens = null) {
        if (!Array.isArray(lista)) {
            return { valido: false, erro: 'Deve ser uma lista' };
        }
        
        if (minItens !== null && lista.length < minItens) {
            return { valido: false, erro: `Mínimo de ${minItens} itens` };
        }
        
        if (maxItens !== null && lista.length > maxItens) {
            return { valido: false, erro: `Máximo de ${maxItens} itens` };
        }
        
        return { valido: true, erro: '' };
    }

    static validarArquivo(arquivo, tiposPermitidos = null, tamanhoMaximoMB = null) {
        if (!arquivo) return { valido: false, erro: 'Arquivo é obrigatório' };
        
        if (tiposPermitidos && !tiposPermitidos.includes(arquivo.type)) {
            return { valido: false, erro: `Tipo de arquivo não permitido. Tipos: ${tiposPermitidos.join(', ')}` };
        }
        
        if (tamanhoMaximoMB && arquivo.size > tamanhoMaximoMB * 1024 * 1024) {
            return { valido: false, erro: `Arquivo muito grande. Máximo: ${tamanhoMaximoMB}MB` };
        }
        
        return { valido: true, erro: '' };
    }

    static validarDadosCalculo(dados) {
        const erros = [];
        
        // Validar nome do produto
        if (!dados.nomeProduto || dados.nomeProduto.trim().length < 2) {
            erros.push('Nome do produto é obrigatório (mínimo 2 caracteres)');
        }
        
        // Validar custo do produto
        if (!dados.custoProduto || dados.custoProduto <= 0) {
            erros.push('Custo do produto deve ser maior que zero');
        }
        
        // Validar percentuais
        const percentuais = ['custoFixo', 'margemLucro', 'icms', 'pisCofins', 'comissao', 'taxaMarketplace'];
        percentuais.forEach(campo => {
            if (dados[campo] < 0 || dados[campo] > 100) {
                erros.push(`${campo} deve estar entre 0% e 100%`);
            }
        });
        
        // Validar soma de percentuais
        const totalPercentuais = dados.icms + dados.pisCofins + dados.comissao + dados.taxaMarketplace + dados.margemLucro;
        if (totalPercentuais >= 100) {
            erros.push('A soma dos percentuais não pode ser 100% ou mais');
        }
        
        return {
            valido: erros.length === 0,
            erro: erros.join('\n')
        };
    }

    static validarCampo(nomeCampo, valor) {
        const validacoes = {
            'nomeProduto': (v) => this.validarTexto(v, 2, 100),
            'custoProduto': (v) => this.validarNumero(v, 0.01),
            'frete': (v) => this.validarNumero(v, 0),
            'embalagem': (v) => this.validarNumero(v, 0),
            'outrosCustos': (v) => this.validarNumero(v, 0),
            'custoFixo': (v) => this.validarNumero(v, 0, 100),
            'margemLucro': (v) => this.validarNumero(v, 0, 100),
            'icms': (v) => this.validarNumero(v, 0, 100),
            'pisCofins': (v) => this.validarNumero(v, 0, 100),
            'comissao': (v) => this.validarNumero(v, 0, 100),
            'taxaMarketplace': (v) => this.validarNumero(v, 0, 100),
            'precoConcorrente': (v) => this.validarNumero(v, 0)
        };
        
        const validacao = validacoes[nomeCampo];
        if (validacao) {
            return validacao(valor);
        }
        
        return { valido: true, erro: '' };
    }

    static validarFormulario(formData) {
        const erros = {};
        
        Object.keys(formData).forEach(campo => {
            const validacao = this.validarCampo(campo, formData[campo]);
            if (!validacao.valido) {
                erros[campo] = validacao.erro;
            }
        });
        
        return {
            valido: Object.keys(erros).length === 0,
            erros
        };
    }
}
