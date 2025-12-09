export class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            HISTORICO: 'precificador_historico',
            CONFIG: 'precificador_config',
            ESTATISTICAS: 'precificador_estatisticas'
        };
        
        this.historico = this.carregarHistorico();
        this.configuracoes = this.carregarConfiguracoes();
        this.estatisticas = this.carregarEstatisticas();
    }

    // Histórico
    async salvarCalculo(calculo) {
        try {
            let historico = await this.carregarHistorico();
            
            // Limitar histórico a 100 itens
            historico.unshift(calculo);
            if (historico.length > 100) {
                historico = historico.slice(0, 100);
            }
            
            localStorage.setItem(this.STORAGE_KEYS.HISTORICO, JSON.stringify(historico));
            this.historico = historico;
            this.atualizarEstatisticas();
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar cálculo:', error);
            return false;
        }
    }

    async carregarHistorico() {
        try {
            const dados = localStorage.getItem(this.STORAGE_KEYS.HISTORICO);
            return dados ? JSON.parse(dados) : [];
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            return [];
        }
    }

    async carregarCalculo(id) {
        const historico = await this.carregarHistorico();
        return historico.find(calc => calc.id === id);
    }

    async removerCalculo(id) {
        try {
            let historico = await this.carregarHistorico();
            historico = historico.filter(calc => calc.id !== id);
            
            localStorage.setItem(this.STORAGE_KEYS.HISTORICO, JSON.stringify(historico));
            this.historico = historico;
            
            return true;
        } catch (error) {
            console.error('Erro ao remover cálculo:', error);
            return false;
        }
    }

    async limparHistorico() {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.HISTORICO);
            this.historico = [];
            return true;
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
            return false;
        }
    }

    // Configurações
    async salvarConfiguracao(chave, valor) {
        try {
            const config = await this.carregarConfiguracoes();
            config[chave] = valor;
            
            localStorage.setItem(this.STORAGE_KEYS.CONFIG, JSON.stringify(config));
            this.configuracoes = config;
            
            return true;
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
            return false;
        }
    }

    async carregarConfiguracao(chave, padrao = null) {
        const config = await this.carregarConfiguracoes();
        return config[chave] !== undefined ? config[chave] : padrao;
    }

    async carregarConfiguracoes() {
        try {
            const dados = localStorage.getItem(this.STORAGE_KEYS.CONFIG);
            return dados ? JSON.parse(dados) : {};
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            return {};
        }
    }

    // Estatísticas
    atualizarEstatisticas() {
        const estatisticas = {
            totalCalculos: this.historico.length,
            ultimoCalculo: this.historico.length > 0 ? this.historico[0].timestamp : null,
            melhorMargem: this.calcularMelhorMargem(),
            categoriaMaisComum: this.calcularCategoriaMaisComum()
        };
        
        localStorage.setItem(this.STORAGE_KEYS.ESTATISTICAS, JSON.stringify(estatisticas));
        this.estatisticas = estatisticas;
    }

    async carregarEstatisticas() {
        try {
            const dados = localStorage.getItem(this.STORAGE_KEYS.ESTATISTICAS);
            return dados ? JSON.parse(dados) : {
                totalCalculos: 0,
                ultimoCalculo: null,
                melhorMargem: 0,
                categoriaMaisComum: null
            };
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            return {
                totalCalculos: 0,
                ultimoCalculo: null,
                melhorMargem: 0,
                categoriaMaisComum: null
            };
        }
    }

    calcularMelhorMargem() {
        if (this.historico.length === 0) return 0;
        
        return Math.max(...this.historico.map(calc => 
            calc.resultado?.margemLiquida || 0
        ));
    }

    calcularCategoriaMaisComum() {
        if (this.historico.length === 0) return null;
        
        const categorias = {};
        this.historico.forEach(calc => {
            const categoria = calc.dados?.categoria || 'outros';
            categorias[categoria] = (categorias[categoria] || 0) + 1;
        });
        
        return Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    }

    // Backup e Restauração
    async fazerBackup() {
        try {
            const backup = {
                historico: this.historico,
                configuracoes: this.configuracoes,
                estatisticas: this.estatisticas,
                timestamp: new Date().toISOString(),
                versao: '2.0'
            };
            
            return JSON.stringify(backup);
        } catch (error) {
            console.error('Erro ao fazer backup:', error);
            return null;
        }
    }

    async restaurarBackup(dados) {
        try {
            const backup = JSON.parse(dados);
            
            if (backup.versao !== '2.0') {
                throw new Error('Versão do backup incompatível');
            }
            
            localStorage.setItem(this.STORAGE_KEYS.HISTORICO, JSON.stringify(backup.historico));
            localStorage.setItem(this.STORAGE_KEYS.CONFIG, JSON.stringify(backup.configuracoes));
            localStorage.setItem(this.STORAGE_KEYS.ESTATISTICAS, JSON.stringify(backup.estatisticas));
            
            // Recarregar dados
            this.historico = backup.historico;
            this.configuracoes = backup.configuracoes;
            this.estatisticas = backup.estatisticas;
            
            return true;
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return false;
        }
    }

    // Utilitários
    get totalCalculos() {
        return this.historico.length;
    }

    get ultimoCalculo() {
        return this.historico.length > 0 ? this.historico[0] : null;
    }
}
