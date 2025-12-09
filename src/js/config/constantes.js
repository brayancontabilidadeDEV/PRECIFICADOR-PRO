export const CONSTANTES = {
    // Configurações da aplicação
    APP: {
        NOME: 'Precificador Pro',
        VERSAO: '2.0.0',
        AUTOR: 'Equipe Precificador',
        ANO: 2024
    },
    
    // Configurações de armazenamento
    STORAGE: {
        PREFIXO: 'precificador_',
        HISTORICO_LIMITE: 100,
        BACKUP_INTERVALO: 24 * 60 * 60 * 1000 // 24 horas
    },
    
    // Configurações de cálculo
    CALCULO: {
        MARGEM_MINIMA: 10,
        MARGEM_IDEAL: 25,
        MARGEM_MAXIMA: 50,
        MARKUP_MINIMO: 20,
        MARKUP_MAXIMO: 300,
        CUSTO_FIXO_PADRAO: 15,
        MARGEM_LUCRO_PADRAO: 30
    },
    
    // Impostos padrão (Brasil)
    IMPOSTOS: {
        ICMS_PADRAO: 18,
        PIS_PADRAO: 1.65,
        COFINS_PADRAO: 7.6,
        PIS_COFINS_PADRAO: 3.65,
        COMISSAO_PADRAO: 10,
        MARKETPLACE_PADRAO: 12
    },
    
    // Segmentos de mercado
    SEGMENTOS: {
        ECONOMICO: {
            nome: 'Econômico',
            margemMinima: 10,
            margemMaxima: 25,
            faixaPreco: { min: 0, max: 50 }
        },
        MEDIO: {
            nome: 'Médio',
            margemMinima: 20,
            margemMaxima: 35,
            faixaPreco: { min: 40, max: 200 }
        },
        PREMIUM: {
            nome: 'Premium',
            margemMinima: 30,
            margemMaxima: 50,
            faixaPreco: { min: 150, max: 500 }
        },
        LUXO: {
            nome: 'Luxo',
            margemMinima: 40,
            margemMaxima: 70,
            faixaPreco: { min: 400, max: 2000 }
        }
    },
    
    // Categorias de produtos
    CATEGORIAS: [
        { id: 'vestuario', nome: 'Vestuário', icone: 'tshirt' },
        { id: 'eletronicos', nome: 'Eletrônicos', icone: 'mobile-alt' },
        { id: 'alimentos', nome: 'Alimentos', icone: 'utensils' },
        { id: 'cosmeticos', nome: 'Cosméticos', icone: 'spa' },
        { id: 'moveis', nome: 'Móveis', icone: 'couch' },
        { id: 'livros', nome: 'Livros', icone: 'book' },
        { id: 'brinquedos', nome: 'Brinquedos', icone: 'gamepad' },
        { id: 'esportes', nome: 'Esportes', icone: 'basketball-ball' },
        { id: 'automotivo', nome: 'Automotivo', icone: 'car' },
        { id: 'ferramentas', nome: 'Ferramentas', icone: 'tools' },
        { id: 'jardim', nome: 'Jardim', icone: 'seedling' },
        { id: 'pet', nome: 'Pet', icone: 'paw' },
        { id: 'saude', nome: 'Saúde', icone: 'heartbeat' },
        { id: 'escritorio', nome: 'Escritório', icone: 'briefcase' },
        { id: 'outros', nome: 'Outros', icone: 'box' }
    ],
    
    // Cores para gráficos
    CORES: {
        PRIMARIAS: [
            '#4361ee', '#3a0ca3', '#7209b7', 
            '#f72585', '#4cc9f0', '#4895ef'
        ],
        SECUNDARIAS: [
            '#2ec4b6', '#e71d36', '#ff9f1c',
            '#011627', '#fdfffc', '#2e294e'
        ],
        GRADIENTES: [
            'linear-gradient(135deg, #4361ee, #3a0ca3)',
            'linear-gradient(135deg, #7209b7, #f72585)',
            'linear-gradient(135deg, #4cc9f0, #4895ef)',
            'linear-gradient(135deg, #2ec4b6, #e71d36)',
            'linear-gradient(135deg, #ff9f1c, #011627)'
        ]
    },
    
    // Mensagens do sistema
    MENSAGENS: {
        SUCESSO: {
            CALCULO: 'Cálculo realizado com sucesso!',
            SALVO: 'Cálculo salvo com sucesso!',
            EXPORTADO: 'Dados exportados com sucesso!',
            IMPORTADO: 'Dados importados com sucesso!',
            LIMPO: 'Dados limpos com sucesso!'
        },
        ERRO: {
            CALCULO: 'Erro ao realizar cálculo',
            SALVAR: 'Erro ao salvar cálculo',
            EXPORTAR: 'Erro ao exportar dados',
            IMPORTAR: 'Erro ao importar dados',
            VALIDACAO: 'Verifique os dados informados'
        },
        INFO: {
            CARREGANDO: 'Carregando...',
            PROCESSANDO: 'Processando...',
            AGUARDE: 'Aguarde...'
        }
    },
    
    // Validações
    VALIDACOES: {
        NOME_PRODUTO_MIN: 2,
        NOME_PRODUTO_MAX: 100,
        CUSTO_MINIMO: 0.01,
        PERCENTUAL_MINIMO: 0,
        PERCENTUAL_MAXIMO: 100,
        PRECO_MINIMO: 0.01
    }
};

// Exportar como padrão também
export default CONSTANTES;
