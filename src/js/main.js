// Módulos
import { Calculadora } from './modules/Calculadora.js';
import { AnaliseMercado } from './modules/AnaliseMercado.js';
import { SistemaRecomendacoes } from './modules/SistemaRecomendacoes.js';
import { Dashboard } from './modules/Dashboard.js';
import { StorageManager } from './modules/StorageManager.js';
import { Exportador } from './modules/Exportador.js';
import { Graficos } from './modules/Graficos.js';
import { Formatadores, Validadores, Helpers } from './utils/index.js';

class PrecificadorApp {
    constructor() {
        this.init();
    }

    async init() {
        // Inicializar módulos
        this.calculadora = new Calculadora();
        this.analiseMercado = new AnaliseMercado();
        this.recomendacoes = new SistemaRecomendacoes();
        this.dashboard = new Dashboard();
        this.storage = new StorageManager();
        this.exportador = new Exportador();
        this.graficos = new Graficos();
        
        // Carregar dados salvos
        await this.carregarDados();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Inicializar dashboard
        this.dashboard.init();
        
        // Mostrar mensagem de boas-vindas
        this.showToast('Precificador Pro carregado com sucesso!', 'success');
        
        // Atualizar estatísticas
        this.atualizarEstatisticas();
    }

    configurarEventos() {
        // Botão calcular
        document.getElementById('btnCalcular').addEventListener('click', () => this.calcular());
        
        // Botão limpar
        document.getElementById('btnLimpar').addEventListener('click', () => this.limparFormulario());
        
        // Botão exemplo
        document.getElementById('btnExemplo').addEventListener('click', () => this.carregarExemplo());
        
        // Tabs principais
        document.querySelectorAll('.tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.mudarTab(e.target.dataset.tab));
        });
        
        // Tabs de resultados
        document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.mudarTabResultados(e.target.dataset.tab));
        });
        
        // Botão salvar
        document.getElementById('btnSalvar').addEventListener('click', () => this.salvarCalculo());
        
        // Botão exportar
        document.getElementById('exportBtn').addEventListener('click', () => this.exportarDados());
        
        // Botão imprimir
        document.getElementById('printBtn').addEventListener('click', () => window.print());
        
        // Inputs com validação em tempo real
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', () => this.validarInput(input));
            input.addEventListener('blur', () => this.validarInput(input));
        });
        
        // Auto-calculação ao mudar valores
        document.querySelectorAll('#calculadoraForm input').forEach(input => {
            input.addEventListener('input', Helpers.debounce(() => {
                if (this.autoCalculate) {
                    this.calcular();
                }
            }, 500));
        });
        
        // Configurações
        document.getElementById('autoSave').addEventListener('change', (e) => {
            this.autoSave = e.target.checked;
            this.storage.salvarConfiguracao('autoSave', this.autoSave);
        });
        
        // Histórico
        document.getElementById('searchHistory').addEventListener('input', 
            Helpers.debounce(() => this.filtrarHistorico(), 300));
        
        document.getElementById('clearHistory').addEventListener('click', 
            () => this.limparHistorico());
    }

    async calcular() {
        try {
            // Coletar dados do formulário
            const dados = this.coletarDadosFormulario();
            
            // Validar dados
            const validacao = Validadores.validarDadosCalculo(dados);
            if (!validacao.valido) {
                throw new Error(validacao.erro);
            }
            
            // Calcular preço
            const resultado = this.calculadora.calcularPreco(dados);
            
            // Realizar análise de mercado
            const analiseMercado = this.analiseMercado.analisar(
                resultado.precoVenda,
                dados.precoConcorrente,
                dados.segmentoMercado
            );
            
            // Gerar recomendações
            const recomendacoes = this.recomendacoes.gerar(
                resultado,
                analiseMercado
            );
            
            // Exibir resultados
            this.exibirResultados(resultado, analiseMercado, recomendacoes);
            
            // Atualizar gráficos
            this.atualizarGraficos(resultado);
            
            // Salvar automaticamente se configurado
            if (this.autoSave) {
                this.salvarCalculo(resultado, dados);
            }
            
            // Mostrar sucesso
            this.showToast('Cálculo realizado com sucesso!', 'success');
            
        } catch (error) {
            this.showToast(error.message, 'error');
            console.error('Erro no cálculo:', error);
        }
    }

    coletarDadosFormulario() {
        return {
            nomeProduto: document.getElementById('nomeProduto').value,
            categoria: document.getElementById('categoria').value,
            custoProduto: parseFloat(document.getElementById('custoProduto').value) || 0,
            frete: parseFloat(document.getElementById('frete').value) || 0,
            embalagem: parseFloat(document.getElementById('embalagem').value) || 0,
            outrosCustos: parseFloat(document.getElementById('outrosCustos').value) || 0,
            custoFixo: parseFloat(document.getElementById('custoFixo').value) || 0,
            margemLucro: parseFloat(document.getElementById('margemLucro').value) || 0,
            icms: parseFloat(document.getElementById('icms').value) || 0,
            pisCofins: parseFloat(document.getElementById('pisCofins').value) || 0,
            comissao: parseFloat(document.getElementById('comissao').value) || 0,
            taxaMarketplace: parseFloat(document.getElementById('taxaMarketplace').value) || 0,
            precoConcorrente: parseFloat(document.getElementById('precoConcorrente').value) || null,
            segmentoMercado: document.getElementById('segmentoMercado').value
        };
    }

    exibirResultados(resultado, analiseMercado, recomendacoes) {
        // Atualizar estatísticas rápidas
        document.getElementById('precoVenda').textContent = 
            Formatadores.formatarMoeda(resultado.precoVenda);
        
        document.getElementById('margemLiquida').textContent = 
            Formatadores.formatarPercentual(resultado.margemLiquida);
        
        document.getElementById('markup').textContent = 
            Formatadores.formatarPercentual(resultado.markup);
        
        document.getElementById('fatorMarkup').textContent = 
            resultado.fatorMarkup.toFixed(2);
        
        // Atualizar status
        this.atualizarStatusPreco(resultado.precoVenda, analiseMercado);
        this.atualizarStatusMargem(resultado.margemLiquida);
        
        // Atualizar detalhes
        this.atualizarDetalhes(resultado);
        
        // Atualizar barras de distribuição
        this.atualizarBarrasDistribuicao(resultado);
        
        // Atualizar análise de mercado
        this.atualizarAnaliseMercado(analiseMercado);
        
        // Atualizar recomendações
        this.atualizarRecomendacoes(recomendacoes);
        
        // Atualizar gráfico de composição
        this.graficos.atualizarGraficoComposicao(resultado);
    }

    atualizarDetalhes(resultado) {
        document.getElementById('custoTotal').textContent = 
            Formatadores.formatarMoeda(resultado.custoTotal);
        
        document.getElementById('totalImpostos').textContent = 
            Formatadores.formatarMoeda(resultado.totalImpostos);
        
        document.getElementById('totalComissoes').textContent = 
            Formatadores.formatarMoeda(resultado.totalComissoes);
        
        document.getElementById('lucroBruto').textContent = 
            Formatadores.formatarMoeda(resultado.lucroBruto);
        
        document.getElementById('lucroLiquido').textContent = 
            Formatadores.formatarMoeda(resultado.lucroLiquido);
    }

    atualizarBarrasDistribuicao(resultado) {
        const distribuicao = resultado.distribuicao;
        
        // Atualizar barras
        document.getElementById('barCustos').style.width = `${distribuicao.custos}%`;
        document.getElementById('barImpostos').style.width = `${distribuicao.impostos}%`;
        document.getElementById('barComissoes').style.width = `${distribuicao.comissoes}%`;
        document.getElementById('barLucro').style.width = `${distribuicao.lucro}%`;
        
        // Atualizar valores
        document.getElementById('valueCustos').textContent = 
            Formatadores.formatarPercentual(distribuicao.custos);
        document.getElementById('valueImpostos').textContent = 
            Formatadores.formatarPercentual(distribuicao.impostos);
        document.getElementById('valueComissoes').textContent = 
            Formatadores.formatarPercentual(distribuicao.comissoes);
        document.getElementById('valueLucro').textContent = 
            Formatadores.formatarPercentual(distribuicao.lucro);
    }

    atualizarStatusPreco(preco, analiseMercado) {
        const statusElement = document.getElementById('statusPreco');
        if (!analiseMercado || !analiseMercado.competitividade) {
            statusElement.textContent = 'Preço calculado';
            statusElement.className = 'stat-label';
            return;
        }
        
        switch(analiseMercado.competitividade) {
            case 'MUITO_AGGRESSIVO':
                statusElement.textContent = 'Muito competitivo';
                statusElement.className = 'stat-label success';
                break;
            case 'AGGRESSIVO':
                statusElement.textContent = 'Competitivo';
                statusElement.className = 'stat-label success';
                break;
            case 'COMPETITIVO':
                statusElement.textContent = 'Bem posicionado';
                statusElement.className = 'stat-label info';
                break;
            case 'PREMIUM':
                statusElement.textContent = 'Acima da média';
                statusElement.className = 'stat-label warning';
                break;
            case 'CARO':
                statusElement.textContent = 'Acima do mercado';
                statusElement.className = 'stat-label danger';
                break;
        }
    }

    atualizarStatusMargem(margem) {
        const statusElement = document.getElementById('statusMargem');
        
        if (margem < 10) {
            statusElement.textContent = 'Margem baixa';
            statusElement.className = 'stat-label danger';
        } else if (margem < 20) {
            statusElement.textContent = 'Margem moderada';
            statusElement.className = 'stat-label warning';
        } else if (margem < 35) {
            statusElement.textContent = 'Margem boa';
            statusElement.className = 'stat-label success';
        } else {
            statusElement.textContent = 'Margem excelente';
            statusElement.className = 'stat-label success';
        }
    }

    async salvarCalculo(resultado = null, dados = null) {
        try {
            if (!resultado || !dados) {
                resultado = this.ultimoResultado;
                dados = this.ultimosDados;
            }
            
            if (!resultado || !dados) {
                throw new Error('Nenhum cálculo para salvar');
            }
            
            const calculo = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                dados,
                resultado,
                analise: this.analiseMercado,
                recomendacoes: this.recomendacoes
            };
            
            await this.storage.salvarCalculo(calculo);
            this.showToast('Cálculo salvo com sucesso!', 'success');
            this.atualizarEstatisticas();
            
        } catch (error) {
            this.showToast('Erro ao salvar cálculo', 'error');
        }
    }

    async carregarDados() {
        // Carregar configurações
        this.autoSave = await this.storage.carregarConfiguracao('autoSave', true);
        document.getElementById('autoSave').checked = this.autoSave;
        
        // Carregar histórico
        await this.carregarHistorico();
    }

    async carregarHistorico() {
        const historico = await this.storage.carregarHistorico();
        this.exibirHistorico(historico);
    }

    exibirHistorico(historico) {
        const container = document.getElementById('historyList');
        if (!historico.length) {
            container.innerHTML = '<div class="empty-state">Nenhum cálculo salvo ainda</div>';
            return;
        }
        
        container.innerHTML = historico.map(calc => `
            <div class="history-item" data-id="${calc.id}">
                <div class="history-header">
                    <h4>${calc.dados.nomeProduto || 'Produto sem nome'}</h4>
                    <span class="history-date">${Formatadores.formatarData(calc.timestamp)}</span>
                </div>
                <div class="history-body">
                    <div class="history-info">
                        <span><strong>Preço:</strong> ${Formatadores.formatarMoeda(calc.resultado.precoVenda)}</span>
                        <span><strong>Margem:</strong> ${Formatadores.formatarPercentual(calc.resultado.margemLiquida)}</span>
                        <span><strong>Custo:</strong> ${Formatadores.formatarMoeda(calc.resultado.custoTotal)}</span>
                    </div>
                    <div class="history-actions">
                        <button class="btn-icon btn-sm" onclick="app.carregarDoHistorico(${calc.id})" title="Carregar">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="btn-icon btn-sm btn-danger" onclick="app.removerDoHistorico(${calc.id})" title="Remover">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async carregarDoHistorico(id) {
        const calculo = await this.storage.carregarCalculo(id);
        if (calculo) {
            this.preencherFormulario(calculo.dados);
            this.showToast('Cálculo carregado com sucesso!', 'success');
        }
    }

    async removerDoHistorico(id) {
        if (confirm('Tem certeza que deseja remover este cálculo?')) {
            await this.storage.removerCalculo(id);
            await this.carregarHistorico();
            this.showToast('Cálculo removido com sucesso!', 'success');
        }
    }

    preencherFormulario(dados) {
        // Preencher todos os campos do formulário
        Object.keys(dados).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = dados[key] || '';
            }
        });
    }

    limparFormulario() {
        if (confirm('Tem certeza que deseja limpar todos os campos?')) {
            document.getElementById('calculadoraForm').reset();
            this.showToast('Formulário limpo com sucesso!', 'success');
        }
    }

    carregarExemplo() {
        const exemplo = {
            nomeProduto: 'Camiseta Premium',
            categoria: 'vestuario',
            custoProduto: 25.00,
            frete: 5.00,
            embalagem: 2.50,
            outrosCustos: 1.50,
            custoFixo: 15,
            margemLucro: 30,
            icms: 18,
            pisCofins: 3.65,
            comissao: 10,
            taxaMarketplace: 12,
            precoConcorrente: 89.90,
            segmentoMercado: 'medio'
        };
        
        this.preencherFormulario(exemplo);
        this.showToast('Exemplo carregado com sucesso!', 'success');
    }

    mudarTab(tab) {
        // Remover active de todas as tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Ativar tab clicada
        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(tab).classList.add('active');
        
        // Se for dashboard, atualizar gráficos
        if (tab === 'dashboard') {
            this.dashboard.atualizar();
        }
    }

    mudarTabResultados(tab) {
        // Remover active de todas as tabs
        document.querySelectorAll('.tabs-nav .tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tabs-content .tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Ativar tab clicada
        document.querySelector(`.tabs-nav .tab-btn[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
    }

    validarInput(input) {
        const validacao = Validadores.validarCampo(input.id, input.value);
        if (!validacao.valido) {
            input.classList.add('error');
            this.showTooltip(input, validacao.erro);
        } else {
            input.classList.remove('error');
        }
    }

    showTooltip(element, message) {
        // Implementar tooltip
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                 type === 'error' ? 'exclamation-circle' : 
                                 type === 'warning' ? 'exclamation-triangle' : 
                                 'info-circle'}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const container = document.getElementById('toastContainer');
        container.appendChild(toast);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    async exportarDados() {
        try {
            const historico = await this.storage.carregarHistorico();
            const dados = {
                historico,
                configuracoes: await this.storage.carregarConfiguracoes(),
                estatisticas: this.gerarEstatisticas()
            };
            
            await this.exportador.exportarJSON(dados, 'precificador-dados.json');
            this.showToast('Dados exportados com sucesso!', 'success');
            
        } catch (error) {
            this.showToast('Erro ao exportar dados', 'error');
        }
    }

    gerarEstatisticas() {
        return {
            totalCalculos: this.storage.totalCalculos || 0,
            mediaMargem: 0,
            melhorMargem: 0,
            categoriaMaisComum: ''
        };
    }

    atualizarEstatisticas() {
        document.getElementById('totalCalculations').textContent = 
            this.storage.totalCalculos || 0;
        
        document.getElementById('savedItems').textContent = 
            this.storage.historico?.length || 0;
    }

    atualizarGraficos(resultado) {
        // Atualizar gráficos com novo resultado
        this.graficos.adicionarDados(resultado);
    }

    atualizarAnaliseMercado(analise) {
        const container = document.getElementById('marketAnalysis');
        if (!analise) {
            container.innerHTML = '<div class="empty-state">Preencha os dados de mercado para ver a análise</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="analysis-card">
                <h4>Competitividade</h4>
                <div class="analysis-value ${analise.competitividade.toLowerCase()}">
                    ${analise.competitividade.replace('_', ' ')}
                </div>
                <p>${analise.recomendacao}</p>
            </div>
            <div class="analysis-card">
                <h4>Posicionamento no Segmento</h4>
                <div class="analysis-value">
                    ${analise.posicionamento || 'N/A'}
                </div>
            </div>
            <div class="analysis-card">
                <h4>Elasticidade de Preço</h4>
                <div class="analysis-value">
                    ${analise.elasticidade || 'N/A'}
                </div>
            </div>
        `;
    }

    atualizarRecomendacoes(recomendacoes) {
        const container = document.getElementById('recommendationsList');
        if (!recomendacoes || !recomendacoes.length) {
            container.innerHTML = '<div class="empty-state">Nenhuma recomendação disponível</div>';
            return;
        }
        
        container.innerHTML = recomendacoes.map(rec => `
            <div class="recommendation-card ${rec.prioridade}">
                <div class="recommendation-icon">
                    <i class="fas fa-${rec.icone || 'lightbulb'}"></i>
                </div>
                <div class="recommendation-content">
                    <h5>${rec.titulo}</h5>
                    <p>${rec.descricao}</p>
                    ${rec.acoes ? `
                        <ul class="recommendation-actions">
                            ${rec.acoes.map(acao => `<li>${acao}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    async filtrarHistorico() {
        // Implementar filtro de histórico
    }

    async limparHistorico() {
        if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            await this.storage.limparHistorico();
            await this.carregarHistorico();
            this.showToast('Histórico limpo com sucesso!', 'success');
        }
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PrecificadorApp();
});
