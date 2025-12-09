export class SistemaRecomendacoes {
    gerar(resultado, analiseMercado) {
        const recomendacoes = [];
        
        // Análise de margem
        recomendacoes.push(...this.analisarMargem(resultado.margemLiquida));
        
        // Análise de competitividade
        if (analiseMercado && analiseMercado.competitividade !== 'INDETERMINADO') {
            recomendacoes.push(...this.analisarCompetitividade(analiseMercado.competitividade));
        }
        
        // Análise de distribuição de custos
        recomendacoes.push(...this.analisarDistribuicao(resultado.distribuicao));
        
        // Recomendações estratégicas
        recomendacoes.push(...this.gerarRecomendacoesEstrategicas(resultado, analiseMercado));
        
        // Ordenar por prioridade
        return recomendacoes.sort((a, b) => {
            const prioridades = { ALTA: 0, MEDIA: 1, BAIXA: 2 };
            return prioridades[a.prioridade] - prioridades[b.prioridade];
        });
    }

    analisarMargem(margem) {
        const recomendacoes = [];
        
        if (margem < 10) {
            recomendacoes.push({
                titulo: 'Margem Muito Baixa',
                descricao: 'Sua margem de lucro está abaixo do recomendado para sustentabilidade do negócio.',
                acoes: [
                    'Reavalie os custos do produto',
                    'Considere aumentar o preço de venda',
                    'Negocie melhores condições com fornecedores'
                ],
                prioridade: 'ALTA',
                icone: 'exclamation-triangle'
            });
        } else if (margem < 20) {
            recomendacoes.push({
                titulo: 'Margem Moderada',
                descricao: 'Sua margem está aceitável, mas há espaço para melhorias.',
                acoes: [
                    'Analise oportunidades de redução de custos',
                    'Considere pequenos ajustes de preço',
                    'Avalie o valor percebido pelo cliente'
                ],
                prioridade: 'MEDIA',
                icone: 'chart-line'
            });
        } else if (margem > 50) {
            recomendacoes.push({
                titulo: 'Margem Excelente',
                descricao: 'Sua margem está muito acima da média. Ótimo trabalho!',
                acoes: [
                    'Considere reinvestir parte do lucro',
                    'Avalie expansão do negócio',
                    'Mantenha a qualidade do produto'
                ],
                prioridade: 'BAIXA',
                icone: 'trophy'
            });
        }
        
        return recomendacoes;
    }

    analisarCompetitividade(competitividade) {
        const recomendacoes = [];
        
        switch(competitividade) {
            case 'MUITO_AGGRESSIVO':
                recomendacoes.push({
                    titulo: 'Preço Muito Competitivo',
                    descricao: 'Seu preço está significativamente abaixo da concorrência.',
                    acoes: [
                        'Considere aumentar gradualmente o preço',
                        'Destaque os diferenciais do produto',
                        'Monitore a reação do mercado'
                    ],
                    prioridade: 'ALTA',
                    icone: 'arrow-down'
                });
                break;
                
            case 'CARO':
                recomendacoes.push({
                    titulo: 'Preço Acima do Mercado',
                    descricao: 'Seu preço está consideravelmente acima da concorrência.',
                    acoes: [
                        'Justifique o preço com benefícios claros',
                        'Invista em branding e posicionamento',
                        'Considere redução de custos'
                    ],
                    prioridade: 'ALTA',
                    icone: 'arrow-up'
                });
                break;
        }
        
        return recomendacoes;
    }

    analisarDistribuicao(distribuicao) {
        const recomendacoes = [];
        
        if (distribuicao.impostos > 30) {
            recomendacoes.push({
                titulo: 'Carga Tributária Elevada',
                descricao: 'Os impostos representam mais de 30% do preço final.',
                acoes: [
                    'Consulte um contador sobre regimes tributários',
                    'Avalie a possibilidade de créditos fiscais',
                    'Considere repassar parte dos impostos'
                ],
                prioridade: 'MEDIA',
                icone: 'landmark'
            });
        }
        
        if (distribuicao.comissoes > 25) {
            recomendacoes.push({
                titulo: 'Comissões Elevadas',
                descricao: 'As comissões estão impactando significativamente o preço.',
                acoes: [
                    'Negocie taxas com marketplaces',
                    'Considere vendas diretas',
                    'Avalie a eficácia das comissões'
                ],
                prioridade: 'MEDIA',
                icone: 'handshake'
            });
        }
        
        if (distribuicao.lucro < 15) {
            recomendacoes.push({
                titulo: 'Lucro Ajustado',
                descricao: 'A parcela de lucro no preço está abaixo do ideal.',
                acoes: [
                    'Busque eficiência operacional',
                    'Analise a cadeia de valor',
                    'Considere repensar o modelo de negócio'
                ],
                prioridade: 'ALTA',
                icone: 'money-bill-wave'
            });
        }
        
        return recomendacoes;
    }

    gerarRecomendacoesEstrategicas(resultado, analiseMercado) {
        const recomendacoes = [];
        
        // Recomendação baseada no momento do negócio
        recomendacoes.push({
            titulo: 'Estratégia de Precificação',
            descricao: this.sugerirEstrategia(resultado, analiseMercado),
            acoes: this.gerarAcoesEstrategicas(resultado, analiseMercado),
            prioridade: 'MEDIA',
            icone: 'chess-board'
        });
        
        // Recomendação de otimização
        if (resultado.detalhes.custos.fixo > resultado.detalhes.custos.produto * 0.3) {
            recomendacoes.push({
                titulo: 'Otimização de Custos Fixos',
                descricao: 'Os custos fixos estão representando uma parcela significativa.',
                acoes: [
                    'Avalie a terceirização de atividades',
                    'Implemente controle de despesas',
                    'Busque eficiência operacional'
                ],
                prioridade: 'MEDIA',
                icone: 'cogs'
            });
        }
        
        return recomendacoes;
    }

    sugerirEstrategia(resultado, analiseMercado) {
        if (analiseMercado?.competitividade === 'MUITO_AGGRESSIVO' && resultado.margemLiquida > 20) {
            return 'Penetração de Mercado: Preço baixo para ganhar market share rapidamente.';
        }
        
        if (analiseMercado?.competitividade === 'CARO' && resultado.margemLiquida > 30) {
            return 'Skimming: Preço alto para maximizar lucro antes da entrada de concorrência.';
        }
        
        if (resultado.margemLiquida >= 25 && resultado.margemLiquida <= 40) {
            return 'Preço Competitivo: Equilíbrio entre lucratividade e competitividade.';
        }
        
        return 'Preço de Valor: Baseado no valor percebido pelo cliente.';
    }

    gerarAcoesEstrategicas(resultado, analiseMercado) {
        const acoes = [];
        
        if (resultado.margemLiquida < 15) {
            acoes.push('Implemente controle rigoroso de custos');
            acoes.push('Estude possíveis aumentos de preço');
            acoes.push('Diversifique a base de fornecedores');
        }
        
        if (analiseMercado?.posicionamento === 'MUITO_ACIMA') {
            acoes.push('Fortaleça o branding do produto');
            acoes.push('Invista em marketing de valor');
            acoes.push('Ofereça garantias estendidas');
        }
        
        if (resultado.distribuicao.impostos > 25) {
            acoes.push('Consulte especialista tributário');
            acoes.push('Avalie mudança de regime fiscal');
        }
        
        return acoes.length > 0 ? acoes : ['Mantenha a estratégia atual e monitore resultados'];
    }
}
