export class Graficos {
    constructor() {
        this.graficos = {};
        this.dados = [];
    }

    init() {
        this.inicializarGraficoComposicao();
        this.inicializarGraficoMargens();
        this.inicializarGraficoCategorias();
    }

    inicializarGraficoComposicao() {
        const ctx = document.getElementById('compositionChart')?.getContext('2d');
        if (!ctx) return;

        this.graficos.composicao = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Custos', 'Impostos', 'Comissões', 'Lucro'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        '#4361ee',
                        '#f8961e',
                        '#4cc9f0',
                        '#4ade80'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    atualizarGraficoComposicao(resultado) {
        if (!this.graficos.composicao || !resultado?.distribuicao) return;

        this.graficos.composicao.data.datasets[0].data = [
            resultado.distribuicao.custos,
            resultado.distribuicao.impostos,
            resultado.distribuicao.comissoes,
            resultado.distribuicao.lucro
        ];

        this.graficos.composicao.update('none');
    }

    inicializarGraficoMargens() {
        const ctx = document.getElementById('marginsChart')?.getContext('2d');
        if (!ctx) return;

        this.graficos.margens = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Margem Líquida (%)',
                    data: [],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Markup (%)',
                    data: [],
                    borderColor: '#f72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `${value}%`
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toFixed(2)}%`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    inicializarGraficoCategorias() {
        const ctx = document.getElementById('categoriesChart')?.getContext('2d');
        if (!ctx) return;

        this.graficos.categorias = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Margem Média (%)',
                    data: [],
                    backgroundColor: '#4361ee',
                    borderColor: '#3a56d4',
                    borderWidth: 1
                }, {
                    label: 'Preço Médio (R$)',
                    data: [],
                    backgroundColor: '#4cc9f0',
                    borderColor: '#45b5d9',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Margem (%)'
                        },
                        ticks: {
                            callback: (value) => `${value}%`
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Preço (R$)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    adicionarDados(resultado) {
        this.dados.push({
            timestamp: new Date(),
            ...resultado
        });

        // Atualizar gráfico de margens
        this.atualizarGraficoMargens();
    }

    atualizarGraficoMargens() {
        if (!this.graficos.margens || this.dados.length === 0) return;

        const ultimosDados = this.dados.slice(-10); // Últimos 10 cálculos
        
        this.graficos.margens.data.labels = ultimosDados.map((_, i) => 
            `Cálculo ${i + 1}`
        );
        
        this.graficos.margens.data.datasets[0].data = ultimosDados.map(d => d.margemLiquida);
        this.graficos.margens.data.datasets[1].data = ultimosDados.map(d => d.markup);
        
        this.graficos.margens.update('none');
    }

    atualizarGraficoCategorias(dadosAgrupados) {
        if (!this.graficos.categorias) return;

        const categorias = Object.keys(dadosAgrupados);
        const margensMedias = categorias.map(cat => 
            dadosAgrupados[cat].margemMedia
        );
        const precosMedios = categorias.map(cat => 
            dadosAgrupados[cat].precoMedio
        );

        this.graficos.categorias.data.labels = categorias;
        this.graficos.categorias.data.datasets[0].data = margensMedias;
        this.graficos.categorias.data.datasets[1].data = precosMedios;
        
        this.graficos.categorias.update('none');
    }

    gerarDadosAgrupados(historico) {
        const agrupados = {};
        
        historico.forEach(calc => {
            const categoria = calc.dados.categoria || 'outros';
            
            if (!agrupados[categoria]) {
                agrupados[categoria] = {
                    total: 0,
                    somaMargens: 0,
                    somaPrecos: 0
                };
            }
            
            agrupados[categoria].total++;
            agrupados[categoria].somaMargens += calc.resultado.margemLiquida;
            agrupados[categoria].somaPrecos += calc.resultado.precoVenda;
        });
        
        // Calcular médias
        Object.keys(agrupados).forEach(categoria => {
            agrupados[categoria].margemMedia = 
                agrupados[categoria].somaMargens / agrupados[categoria].total;
            agrupados[categoria].precoMedio = 
                agrupados[categoria].somaPrecos / agrupados[categoria].total;
        });
        
        return agrupados;
    }

    destroy() {
        Object.values(this.graficos).forEach(grafico => {
            if (grafico) grafico.destroy();
        });
        this.graficos = {};
    }
}
