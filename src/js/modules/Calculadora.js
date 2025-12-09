export class Calculadora {
    calcularPreco(dados) {
        // Calcular custo total
        const custoTotal = this.calcularCustoTotal(dados);
        
        // Calcular preço de venda
        const precoVenda = this.calcularPrecoVenda(dados, custoTotal);
        
        // Calcular impostos e taxas
        const impostosTaxas = this.calcularImpostosTaxas(precoVenda, dados);
        
        // Calcular lucros
        const lucros = this.calcularLucros(precoVenda, custoTotal, impostosTaxas);
        
        // Calcular markup
        const markup = this.calcularMarkup(precoVenda, custoTotal);
        
        // Calcular distribuição
        const distribuicao = this.calcularDistribuicao(precoVenda, custoTotal, impostosTaxas, lucros.lucroLiquido);
        
        return {
            precoVenda: parseFloat(precoVenda.toFixed(2)),
            custoTotal: parseFloat(custoTotal.toFixed(2)),
            markup: parseFloat(markup.toFixed(2)),
            fatorMarkup: parseFloat((precoVenda / custoTotal).toFixed(2)),
            margemLiquida: parseFloat(lucros.margemLiquida.toFixed(2)),
            lucroBruto: parseFloat(lucros.lucroBruto.toFixed(2)),
            lucroLiquido: parseFloat(lucros.lucroLiquido.toFixed(2)),
            totalImpostos: parseFloat(impostosTaxas.total.toFixed(2)),
            totalComissoes: parseFloat(impostosTaxas.comissoes.toFixed(2)),
            distribuicao,
            detalhes: {
                custos: this.detalharCustos(dados),
                impostos: impostosTaxas.detalhados,
                comissoes: impostosTaxas.comissoesDetalhadas
            }
        };
    }

    calcularCustoTotal(dados) {
        return dados.custoProduto + 
               dados.frete + 
               dados.embalagem + 
               dados.outrosCustos;
    }

    calcularPrecoVenda(dados, custoTotal) {
        // Adicionar custo fixo
        const custoComFixo = custoTotal * (1 + dados.custoFixo / 100);
        
        // Calcular preço considerando margem desejada
        const taxaTotal = (dados.icms + dados.pisCofins + dados.comissao + dados.taxaMarketplace) / 100;
        
        // Fórmula: Preço = (Custo + Custo Fixo) / (1 - Taxas - Margem Desejada)
        const preco = custoComFixo / (1 - taxaTotal - (dados.margemLucro / 100));
        
        return preco;
    }

    calcularImpostosTaxas(preco, dados) {
        const icms = preco * (dados.icms / 100);
        const pisCofins = preco * (dados.pisCofins / 100);
        const comissao = preco * (dados.comissao / 100);
        const taxaMarketplace = preco * (dados.taxaMarketplace / 100);
        
        return {
            icms: parseFloat(icms.toFixed(2)),
            pisCofins: parseFloat(pisCofins.toFixed(2)),
            comissao: parseFloat(comissao.toFixed(2)),
            taxaMarketplace: parseFloat(taxaMarketplace.toFixed(2)),
            total: parseFloat((icms + pisCofins + comissao + taxaMarketplace).toFixed(2)),
            detalhados: {
                icms: { valor: icms, percentual: dados.icms },
                pisCofins: { valor: pisCofins, percentual: dados.pisCofins }
            },
            comissoesDetalhadas: {
                vendedor: { valor: comissao, percentual: dados.comissao },
                marketplace: { valor: taxaMarketplace, percentual: dados.taxaMarketplace }
            }
        };
    }

    calcularLucros(preco, custoTotal, impostosTaxas) {
        const lucroBruto = preco - custoTotal;
        const lucroLiquido = lucroBruto - impostosTaxas.total;
        const margemLiquida = (lucroLiquido / preco) * 100;
        
        return {
            lucroBruto: parseFloat(lucroBruto.toFixed(2)),
            lucroLiquido: parseFloat(lucroLiquido.toFixed(2)),
            margemLiquida: parseFloat(margemLiquida.toFixed(2))
        };
    }

    calcularMarkup(preco, custo) {
        return ((preco - custo) / custo) * 100;
    }

    calcularDistribuicao(preco, custo, impostosTaxas, lucroLiquido) {
        const custosPercent = (custo / preco) * 100;
        const impostosPercent = ((impostosTaxas.icms + impostosTaxas.pisCofins) / preco) * 100;
        const comissoesPercent = ((impostosTaxas.comissao + impostosTaxas.taxaMarketplace) / preco) * 100;
        const lucroPercent = (lucroLiquido / preco) * 100;
        
        // Ajustar para somar 100%
        const ajuste = 100 - (custosPercent + impostosPercent + comissoesPercent + lucroPercent);
        if (Math.abs(ajuste) > 0.01) {
            lucroPercent += ajuste;
        }
        
        return {
            custos: parseFloat(custosPercent.toFixed(2)),
            impostos: parseFloat(impostosPercent.toFixed(2)),
            comissoes: parseFloat(comissoesPercent.toFixed(2)),
            lucro: parseFloat(lucroPercent.toFixed(2))
        };
    }

    detalharCustos(dados) {
        return {
            produto: dados.custoProduto,
            frete: dados.frete,
            embalagem: dados.embalagem,
            outros: dados.outrosCustos,
            fixo: (dados.custoProduto + dados.frete + dados.embalagem + dados.outrosCustos) * (dados.custoFixo / 100)
        };
    }

    simularVariacoes(precoBase, variacoes = [-20, -15, -10, -5, 0, 5, 10, 15, 20]) {
        return variacoes.map(variacao => {
            const novoPreco = precoBase * (1 + (variacao / 100));
            return {
                variacao,
                novoPreco: parseFloat(novoPreco.toFixed(2)),
                impactoPercentual: variacao
            };
        });
    }
}
