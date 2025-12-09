export class Exportador {
    async exportarJSON(dados, nomeArquivo = 'precificador-dados.json') {
        try {
            const json = JSON.stringify(dados, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Erro ao exportar JSON:', error);
            return false;
        }
    }

    async exportarCSV(dados, nomeArquivo = 'precificador-dados.csv') {
        try {
            // Converter histórico para CSV
            const cabecalho = [
                'Data',
                'Produto',
                'Categoria',
                'Custo Total',
                'Preço Venda',
                'Margem Líquida',
                'Markup',
                'Lucro Líquido',
                'Impostos',
                'Comissões'
            ].join(',');
            
            const linhas = dados.historico.map(calc => [
                new Date(calc.timestamp).toLocaleDateString('pt-BR'),
                calc.dados.nomeProduto || '',
                calc.dados.categoria || '',
                calc.resultado.custoTotal.toFixed(2),
                calc.resultado.precoVenda.toFixed(2),
                calc.resultado.margemLiquida.toFixed(2) + '%',
                calc.resultado.markup.toFixed(2) + '%',
                calc.resultado.lucroLiquido.toFixed(2),
                calc.resultado.totalImpostos.toFixed(2),
                calc.resultado.totalComissoes.toFixed(2)
            ].join(','));
            
            const csv = [cabecalho, ...linhas].join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = nomeArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            return false;
        }
    }

    async exportarPDF(resultado, dados) {
        try {
            // Esta função requer uma biblioteca como jsPDF
            // Implementação básica para demonstração
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Adicionar conteúdo
            doc.setFontSize(18);
            doc.text('Relatório de Precificação', 20, 20);
            
            doc.setFontSize(12);
            doc.text(`Produto: ${dados.nomeProduto}`, 20, 40);
            doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);
            
            // Adicionar tabela de resultados
            const resultados = [
                ['Item', 'Valor'],
                ['Custo Total', `R$ ${resultado.custoTotal.toFixed(2)}`],
                ['Preço de Venda', `R$ ${resultado.precoVenda.toFixed(2)}`],
                ['Margem Líquida', `${resultado.margemLiquida.toFixed(2)}%`],
                ['Lucro Líquido', `R$ ${resultado.lucroLiquido.toFixed(2)}`],
                ['Markup', `${resultado.markup.toFixed(2)}%`]
            ];
            
            doc.autoTable({
                startY: 60,
                head: [resultados[0]],
                body: resultados.slice(1),
                theme: 'striped'
            });
            
            // Salvar PDF
            doc.save(`precificacao-${dados.nomeProduto || 'produto'}.pdf`);
            
            return true;
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            return false;
        }
    }

    gerarRelatorioDetalhado(resultado, dados, analiseMercado, recomendacoes) {
        const relatorio = {
            cabecalho: {
                titulo: 'Relatório de Precificação Detalhado',
                produto: dados.nomeProduto,
                data: new Date().toISOString(),
                categoria: dados.categoria
            },
            resumo: {
                precoVenda: resultado.precoVenda,
                custoTotal: resultado.custoTotal,
                margemLiquida: resultado.margemLiquida,
                markup: resultado.markup,
                lucroLiquido: resultado.lucroLiquido
            },
            detalhamento: {
                custos: resultado.detalhes.custos,
                impostos: resultado.detalhes.impostos,
                comissoes: resultado.detalhes.comissoes,
                distribuicao: resultado.distribuicao
            },
            analise: {
                mercado: analiseMercado,
                competitividade: analiseMercado?.competitividade || 'N/A',
                posicionamento: analiseMercado?.posicionamento || 'N/A'
            },
            recomendacoes: recomendacoes || [],
            observacoes: 'Este relatório foi gerado automaticamente pelo Precificador Pro.'
        };
        
        return relatorio;
    }

    async compartilharResultados(resultado, dados) {
        try {
            const texto = `💰 Precificação: ${dados.nomeProduto}
            
📊 Resultados:
• Preço de Venda: R$ ${resultado.precoVenda.toFixed(2)}
• Margem Líquida: ${resultado.margemLiquida.toFixed(2)}%
• Custo Total: R$ ${resultado.custoTotal.toFixed(2)}
• Lucro Líquido: R$ ${resultado.lucroLiquido.toFixed(2)}

📈 Gerado com Precificador Pro`;
            
            if (navigator.share) {
                await navigator.share({
                    title: `Precificação: ${dados.nomeProduto}`,
                    text: texto,
                    url: window.location.href
                });
                return true;
            } else {
                // Fallback para copiar para área de transferência
                await navigator.clipboard.writeText(texto);
                return 'copied';
            }
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            return false;
        }
    }
}
