export class Dashboard {
    constructor() {
        this.dados = [];
        this.metricas = {};
    }

    async init() {
        await this.carregarDados();
        this.calcularMetricas();
        this.renderizar();
    }

    async carregarDados() {
        // Carregar dados do histórico
        const storage = new StorageManager();
        const historico = await storage.carregarHistorico();
        
        this.dados = historico.map(calc => ({
            ...calc.resultado,
            categoria: calc.dados.categoria,
            nomeProduto: calc.dados.nomeProduto,
            timestamp: calc.timestamp
        }));
    }

    calcularMetricas() {
        if (this.dados.length === 0) {
            this.metricas = {
                totalCalculos: 0,
                mediaMargem: 0,
                melhorMargem: 0,
                mediaPreco: 0,
                totalLucro: 0,
                distribuicaoCategorias: {},
                tendencias: []
            };
            return;
        }

        // Métricas básicas
        this.metricas.totalCalculos = this.dados.length;
        this.metricas.mediaMargem = this.calcularMedia('margemLiquida');
        this.metricas.melhorMargem = Math.max(...this.dados.map(d => d.margemLiquida));
        this.metricas.mediaPreco = this.calcularMedia('precoVenda');
        this.metricas.totalLucro = this.dados.reduce((sum, d) => sum + d.lucroLiquido, 0);

        // Distribuição por categoria
        this.metricas.distribuicaoCategorias = this.calcularDistribuicaoCategorias();

        // Tendências
        this.metricas.tendencias = this.calcularTendencias();
    }

    calcularMedia(campo) {
        const soma = this.dados.reduce((sum, d) => sum + d[campo], 0);
        return soma / this.dados.length;
    }

    calcularDistribuicaoCategorias() {
        const distribuicao = {};
        
        this.dados.forEach(dado => {
            const categoria = dado.categoria || 'outros';
            distribuicao[categoria] = (distribuicao[categoria] || 0) + 1;
        });
        
        return distribuicao;
    }

    calcularTendencias() {
        if (this.dados.length < 2) return [];
        
        const tendencias = [];
        const ultimosDados = this.dados.slice(-5); // Últimos 5 cálculos
        
        // Calcular tendência de margem
        const margens = ultimosDados.map(d => d.margemLiquida);
        const tendenciaMargem = this.calcularVariacao(margens);
        tendencias.push({
            tipo: 'margem',
            direcao: tendenciaMargem > 0 ? 'alta' : tendenciaMargem < 0 ? 'baixa' : 'estável',
            magnitude: Math.abs(tendenciaMargem)
        });
        
        // Calcular tendência de preço
        const precos = ultimosDados.map(d => d.precoVenda);
        const tendenciaPreco = this.calcularVariacao(precos);
        tendencias.push({
            tipo: 'preco',
            direcao: tendenciaPreco > 0 ? 'alta' : tendenciaPreco < 0 ? 'baixa' : 'estável',
            magnitude: Math.abs(tendenciaPreco)
        });
        
        return tendencias;
    }

    calcularVariacao(valores) {
        if (valores.length < 2) return 0;
        
        const primeiro = valores[0];
        const ultimo = valores[valores.length - 1];
        
        return ((ultimo - primeiro) / primeiro) * 100;
    }

    renderizar() {
        this.renderizarMetricas();
        this.renderizarTendencias();
        this.renderizarTopProdutos();
    }

    renderizarMetricas() {
        const container = document.getElementById('trendsContent');
        if (!container) return;
        
        container.innerHTML = `
            <div class="metricas-grid">
                <div class="metrica">
                    <div class="metrica-titulo">Cálculos Totais</div>
                    <div class="metrica-valor">${this.metricas.totalCalculos}</div>
                </div>
                <div class="metrica">
                    <div class="metrica-titulo">Média Margem</div>
                    <div class="metrica-valor">${this.metricas.mediaMargem.toFixed(2)}%</div>
                </div>
                <div class="metrica">
                    <div class="metrica-titulo">Melhor Margem</div>
                    <div class="metrica-valor">${this.metricas.melhorMargem.toFixed(2)}%</div>
                </div>
                <div class="metrica">
                    <div class="metrica-titulo">Lucro Total</div>
                    <div class="metrica-valor">R$ ${this.metricas.totalLucro.toFixed(2)}</div>
                </div>
            </div>
        `;
    }

    renderizarTendencias() {
        const tendencias = this.metricas.tendencias;
        if (tendencias.length === 0) return;
        
        const container = document.getElementById('trendsContent');
        if (!container) return;
        
        const tendenciasHTML = tendencias.map(t => `
            <div class="tendencia ${t.direcao}">
                <i class="fas fa-arrow-${t.direcao === 'alta' ? 'up' : t.direcao === 'baixa' ? 'down' : 'right'}"></i>
                <span>${t.tipo}: ${t.direcao} (${t.magnitude.toFixed(2)}%)</span>
            </div>
        `).join('');
        
        container.innerHTML += `
            <div class="tendencias-section">
                <h4>Tendências Recentes</h4>
                ${tendenciasHTML}
            </div>
        `;
    }

    renderizarTopProdutos() {
        const container = document.getElementById('topProducts');
        if (!container || this.dados.length === 0) return;
        
        // Ordenar por margem
        const topProdutos = [...this.dados]
            .sort((a, b) => b.margemLiquida - a.margemLiquida)
            .slice(0, 5);
        
        const produtosHTML = topProdutos.map((produto, index) => `
            <div class="top-produto">
                <div class="rank">${index + 1}</div>
                <div class="produto-info">
                    <div class="produto-nome">${produto.nomeProduto || 'Produto sem nome'}</div>
                    <div class="produto-metricas">
                        <span class="metrica">Margem: ${produto.margemLiquida.toFixed(2)}%</span>
                        <span class="metrica">Preço: R$ ${produto.precoVenda.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="top-produtos-list">
                ${produtosHTML}
            </div>
        `;
    }

    async atualizar() {
        await this.carregarDados();
        this.calcularMetricas();
        this.renderizar();
    }

    gerarRelatorio() {
        return {
            resumo: {
                totalCalculos: this.metricas.totalCalculos,
                periodo: this.obterPeriodo(),
                metricas: {
                    mediaMargem: this.metricas.mediaMargem,
                    melhorMargem: this.metricas.melhorMargem,
                    mediaPreco: this.metricas.mediaPreco,
                    totalLucro: this.metricas.totalLucro
                }
            },
            distribuicao: this.metricas.distribuicaoCategorias,
            tendencias: this.metricas.tendencias,
            topProdutos: this.obterTopProdutos(5)
        };
    }

    obterPeriodo() {
        if (this.dados.length === 0) return 'Nenhum dado';
        
        const datas = this.dados.map(d => new Date(d.timestamp));
        const maisAntiga = new Date(Math.min(...datas));
        const maisRecente = new Date(Math.max(...datas));
        
        return {
            inicio: maisAntiga.toLocaleDateString('pt-BR'),
            fim: maisRecente.toLocaleDateString('pt-BR'),
            dias: Math.ceil((maisRecente - maisAntiga) / (1000 * 60 * 60 * 24))
        };
    }

    obterTopProdutos(quantidade = 5) {
        return [...this.dados]
            .sort((a, b) => b.margemLiquida - a.margemLiquida)
            .slice(0, quantidade)
            .map(p => ({
                nome: p.nomeProduto,
                margem: p.margemLiquida,
                preco: p.precoVenda,
                lucro: p.lucroLiquido
            }));
    }
}
