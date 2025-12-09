export class Helpers {
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static formatarBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static gerarID(tamanho = 8) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        
        for (let i = 0; i < tamanho; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        
        return resultado;
    }

    static gerarCorAleatoria() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        
        return color;
    }

    static gerarCorDegrade(quantidade) {
        const cores = [];
        const hueStep = 360 / quantidade;
        
        for (let i = 0; i < quantidade; i++) {
            const hue = i * hueStep;
            cores.push(`hsl(${hue}, 70%, 60%)`);
        }
        
        return cores;
    }

    static calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }

    static diasEntreDatas(data1, data2) {
        const umDia = 24 * 60 * 60 * 1000;
        const primeiraData = new Date(data1);
        const segundaData = new Date(data2);
        
        return Math.round(Math.abs((primeiraData - segundaData) / umDia));
    }

    static formatarTempoDecorrido(data) {
        const agora = new Date();
        const dataPassada = new Date(data);
        const diferenca = agora - dataPassada;
        
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

    static capitalizarTexto(texto) {
        if (!texto) return '';
        
        return texto
            .toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    }

    static removerAcentos(texto) {
        if (!texto) return '';
        
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    static formatarNumeroTelefone(numero) {
        if (!numero) return '';
        
        numero = numero.replace(/\D/g, '');
        
        if (numero.length === 11) {
            return `(${numero.substring(0, 2)}) ${numero.substring(2, 7)}-${numero.substring(7)}`;
        } else if (numero.length === 10) {
            return `(${numero.substring(0, 2)}) ${numero.substring(2, 6)}-${numero.substring(6)}`;
        }
        
        return numero;
    }

    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validarURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static extrairNumeros(texto) {
        if (!texto) return '';
        return texto.replace(/\D/g, '');
    }

    static formatarCPF(cpf) {
        if (!cpf) return '';
        
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length === 11) {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        
        return cpf;
    }

    static formatarCNPJ(cnpj) {
        if (!cnpj) return '';
        
        cnpj = cnpj.replace(/\D/g, '');
        
        if (cnpj.length === 14) {
            return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        return cnpj;
    }

    static formatarCEP(cep) {
        if (!cep) return '';
        
        cep = cpf.replace(/\D/g, '');
        
        if (cep.length === 8) {
            return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        
        return cep;
    }

    static ordenarPorPropriedade(array, propriedade, ordem = 'asc') {
        return array.sort((a, b) => {
            let aVal = a[propriedade];
            let bVal = b[propriedade];
            
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) {
                return ordem === 'asc' ? -1 : 1;
            }
            if (aVal > bVal) {
                return ordem === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    static filtrarPorTexto(array, texto, propriedades) {
        if (!texto) return array;
        
        const textoBusca = this.removerAcentos(texto.toLowerCase());
        
        return array.filter(item => {
            return propriedades.some(prop => {
                const valor = item[prop];
                if (!valor) return false;
                
                const valorNormalizado = this.removerAcentos(valor.toString().toLowerCase());
                return valorNormalizado.includes(textoBusca);
            });
        });
    }

    static agruparPorPropriedade(array, propriedade) {
        return array.reduce((grupos, item) => {
            const chave = item[propriedade];
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(item);
            return grupos;
        }, {});
    }

    static calcularMedia(array, propriedade) {
        if (array.length === 0) return 0;
        
        const soma = array.reduce((total, item) => {
            return total + (item[propriedade] || 0);
        }, 0);
        
        return soma / array.length;
    }

    static calcularMediana(array, propriedade) {
        if (array.length === 0) return 0;
        
        const valores = array
            .map(item => item[propriedade] || 0)
            .sort((a, b) => a - b);
        
        const meio = Math.floor(valores.length / 2);
        
        if (valores.length % 2 === 0) {
            return (valores[meio - 1] + valores[meio]) / 2;
        }
        
        return valores[meio];
    }

    static calcularModa(array, propriedade) {
        if (array.length === 0) return null;
        
        const frequencia = {};
        let maxFreq = 0;
        let moda = null;
        
        array.forEach(item => {
            const valor = item[propriedade];
            if (valor !== undefined && valor !== null) {
                frequencia[valor] = (frequencia[valor] || 0) + 1;
                
                if (frequencia[valor] > maxFreq) {
                    maxFreq = frequencia[valor];
                    moda = valor;
                }
            }
        });
        
        return moda;
    }

    static calcularDesvioPadrao(array, propriedade) {
        if (array.length === 0) return 0;
        
        const media = this.calcularMedia(array, propriedade);
        const diferencasQuadradas = array.map(item => {
            const diferenca = (item[propriedade] || 0) - media;
            return diferenca * diferenca;
        });
        
        const mediaDiferencas = this.calcularMedia(diferencasQuadradas, '');
        return Math.sqrt(mediaDiferencas);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static copiarParaClipboard(texto) {
        return navigator.clipboard.writeText(texto);
    }

    static downloadConteudo(conteudo, nomeArquivo, tipo = 'text/plain') {
        const blob = new Blob([conteudo], { type: tipo });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    static lerArquivo(arquivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsText(arquivo);
        });
    }

    static formatarDataParaInput(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const ano = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        
        return `${ano}-${mes}-${dia}`;
    }

    static gerarCorBaseadaEmTexto(texto) {
        let hash = 0;
        
        for (let i = 0; i < texto.length; i++) {
            hash = texto.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const cor = `hsl(${hash % 360}, 70%, 60%)`;
        return cor;
    }

    static criarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }

    static truncarTexto(texto, limite, sufixo = '...') {
        if (texto.length <= limite) return texto;
        
        return texto.substring(0, limite).trim() + sufixo;
    }

    static contarPalavras(texto) {
        if (!texto) return 0;
        
        return texto
            .trim()
            .split(/\s+/)
            .filter(palavra => palavra.length > 0)
            .length;
    }

    static contarCaracteres(texto, incluirEspacos = true) {
        if (!texto) return 0;
        
        if (incluirEspacos) {
            return texto.length;
        }
        
        return texto.replace(/\s/g, '').length;
    }

    static inverterString(texto) {
        if (!texto) return '';
        
        return texto.split('').reverse().join('');
    }

    static ePalindromo(texto) {
        if (!texto) return false;
        
        const textoLimpo = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
        const textoInvertido = this.inverterString(textoLimpo);
        
        return textoLimpo === textoInvertido;
    }

    static gerarSequenciaNumerica(inicio, fim, passo = 1) {
        const sequencia = [];
        
        for (let i = inicio; i <= fim; i += passo) {
            sequencia.push(i);
        }
        
        return sequencia;
    }

    static embaralharArray(array) {
        const embaralhado = [...array];
        
        for (let i = embaralhado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [embaralhado[i], embaralhado[j]] = [embaralhado[j], embaralhado[i]];
        }
        
        return embaralhado;
    }

    static removerDuplicatas(array) {
        return [...new Set(array)];
    }

    static intersecao(array1, array2) {
        return array1.filter(item => array2.includes(item));
    }

    static uniao(array1, array2) {
        return [...new Set([...array1, ...array2])];
    }

    static diferenca(array1, array2) {
        return array1.filter(item => !array2.includes(item));
    }
}
