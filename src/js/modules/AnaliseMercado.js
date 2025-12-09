export class AnaliseMercado {
    analisar(precoSugerido, precoConcorrente, segmento) {
        const competitividade = this.analisarCompetitividade(precoSugerido, precoConcorrente);
        const posicionamento = this.analisarPosicionamento(precoSugerido, segmento);
        const elasticidade = this.analisarElasticidade(segmento);
        
        return {
            competitividade,
            posicionamento,
            elasticidade,
            recomendacao: this.gerarRecomendacao(competitividade, posicionamento),
            dadosConcorrencia: {
                precoConcorrente,
                diferenca: precoConcorrente ? precoSugerido - precoConcorrente : null,
                diferencaPercentual: precoConcorrente ? 
                    ((precoSugerido - precoConcorrente) / precoConcorrente) * 100 : null
            }
        };
    }

    analisarCompetitividade(precoSugerido, precoConcorrente) {
        if (!precoConcorrente || precoConcorrente <= 0) {
            return 'INDETERMINADO';
        }
        
        const diferencaPercentual = ((precoSugerido - precoConcorrente) / precoConcorrente) * 100;
        
        if (diferencaPercentual < -30) return 'MUITO_AGGRESSIVO';
        if (diferencaPercentual < -15) return 'AGGRESSIVO';
        if (diferencaPercentual < 5) return 'COMPETITIVO';
        if (diferencaPercentual < 20) return 'PREMIUM';
        return 'CARO';
    }

    analisarPosicionamento(preco, segmento) {
        const faixas = {
            'economico': { min: 0, max: 50, ideal: 25 },
            'medio': { min: 40, max: 200, ideal: 100 },
            'premium': { min: 150, max: 500, ideal: 300 },
            'luxo': { min: 400, max: 2000, ideal: 800 }
        };
        
        const faixa = faixas[segmento] || faixas.medio;
        
        if (preco < faixa.min * 0.8) return 'MUITO_ABAIXO';
        if (preco < faixa.min) return 'ABAIXO';
        if (preco <= faixa.max) return 'DENTRO_DA_FAIXA';
        if (preco <= faixa.max * 1.2) return 'ACIMA';
        return 'MUITO_ACIMA';
    }

    analisarElasticidade(segmento) {
        const elasticidades = {
            'economico': 'ALTA',
            'medio': 'MEDIA',
            'premium': 'BAIXA',
            'luxo': 'MUITO_BAIXA'
        };
        
        return elasticidades[segmento] || 'MEDIA';
    }

    gerarRecomendacao(competitividade, posicionamento) {
        const recomendacoes = {
            'MUITO_AGGRESSIVO': 'Preço muito abaixo do mercado. Considere aumentar para melhorar a margem.',
            'AGGRESSIVO': 'Preço competitivo. Boa posição para capturar market share.',
            'COMPETITIVO': 'Preço alinhado com o mercado. Posição equilibrada.',
            'PREMIUM': 'Preço acima da média. Garanta que o produto oferece valor correspondente.',
            'CARO': 'Preço significativamente acima. Avalie a justificativa para este preço.',
            'INDETERMINADO': 'Informe o preço da concorrência para uma análise completa.'
        };
        
        return recomendacoes[competitividade];
    }

    compararComBenchmarks(preco, categoria) {
        const benchmarks = {
            'vestuario': { min: 30, media: 80, max: 200 },
            'eletronicos': { min: 100, media: 500, max: 2000 },
            'alimentos': { min: 10, media: 50, max: 200 },
            'cosmeticos': { min: 20, media: 100, max: 500 },
            'moveis': { min: 200, media: 1000, max: 5000 }
        };
        
        const benchmark = benchmarks[categoria] || benchmarks.vestuario;
        
        return {
            benchmark,
            posicao: preco < benchmark.min ? 'abaixo' : 
                    preco > benchmark.max ? 'acima' : 'dentro',
            diferencaMin: preco - benchmark.min,
            diferencaMedia: preco - benchmark.media,
            diferencaMax: preco - benchmark.max
        };
    }
}
