// Variáveis globais
let dadosGastos = [];
let dadosIngressos = [];
let dadosProdutos = [];
let gastosChart = null;
let receitaChart = null;
let ingressosChart = null;
let produtosChart = null;

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const evento_id = sessionStorage.getItem("evento_id");
    console.log("ID do evento:", evento_id);
    
    if (evento_id) {
        carregarDados(evento_id);
    } else {
        console.error("ID do evento não encontrado");
    }
});

// Função principal para carregar dados
async function carregarDados(evento_id) {
    console.log(`Carregando dados para evento ${evento_id}`);
    
    await carregarGastos(evento_id);
    await carregarIngressos(evento_id);
    await carregarProdutos(evento_id);
    
    console.log("Dados carregados:", {
        gastos: dadosGastos.length,
        ingressos: dadosIngressos.length,
        produtos: dadosProdutos.length
    });

    // Atualizar dashboard após carregar dados
    atualizarKPIs();
    criarGraficos();
}

// Carregar gastos
async function carregarGastos(evento_id) {
    try {
        console.log(`Buscando gastos: /gasto/buscar_gastos/${evento_id}`);
        const response = await fetch(`/gasto/buscar_gastos/${evento_id}`);
        
        if (response.ok) {
            dadosGastos = await response.json();
            console.log("Gastos encontrados:", dadosGastos);
        } else {
            console.error(`Erro ao buscar gastos: ${response.status}`);
            dadosGastos = [];
        }
    } catch (error) {
        console.error('Erro ao carregar gastos:', error);
        dadosGastos = [];
    }
}

// Carregar ingressos
async function carregarIngressos(evento_id) {
    try {
        console.log(`Buscando ingressos: /ingressos/buscar_ingressos/${evento_id}`);
        const response = await fetch(`/ingressos/buscar_ingressos/${evento_id}`);
        
        if (response.ok) {
            dadosIngressos = await response.json();
            console.log("Ingressos encontrados:", dadosIngressos);
        } else {
            console.error(`Erro ao buscar ingressos: ${response.status}`);
            dadosIngressos = [];
        }
    } catch (error) {
        console.error('Erro ao carregar ingressos:', error);
        dadosIngressos = [];
    }
}

// Carregar produtos
async function carregarProdutos(evento_id) {
    try {
        console.log(`Buscando produtos: /produtos/buscar_produtos/${evento_id}`);
        const response = await fetch(`/produtos/buscar_produtos/${evento_id}`);
        
        if (response.ok) {
            dadosProdutos = await response.json();
            console.log("Produtos encontrados:", dadosProdutos);
        } else {
            console.error(`Erro ao buscar produtos: ${response.status}`);
            dadosProdutos = [];
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        dadosProdutos = [];
    }
}

// Atualizar KPIs com dados reais
function atualizarKPIs() {
    // Total de gastos
    const totalGastos = dadosGastos.reduce((total, gasto) => total + parseFloat(gasto.valor || 0), 0);
    
    // Total de receita
    const receitaIngressos = dadosIngressos.reduce((total, ingresso) => 
        total + (parseFloat(ingresso.valor || 0) * parseInt(ingresso.quantidade || 0)), 0);
    const receitaProdutos = dadosProdutos.reduce((total, produto) => 
        total + (parseFloat(produto.valor || 0) * parseInt(produto.quantidade || 0)), 0);
    const receitaTotal = receitaIngressos + receitaProdutos;
    
    // Lucro
    const lucro = receitaTotal - totalGastos;

    // Atualizar na tela
    const gastoElement = document.querySelector('.kpi:nth-child(1) .dinheiro');
    const receitaElement = document.querySelector('.kpi:nth-child(2) .dinheiro');
    const lucroElement = document.querySelector('.kpi:nth-child(4) .dinheiro');
    const statusElement = document.querySelector('.kpi:nth-child(3) p');

    if (gastoElement) gastoElement.textContent = formatarMoeda(totalGastos);
    if (receitaElement) receitaElement.textContent = formatarMoeda(receitaTotal);
    if (lucroElement) lucroElement.textContent = formatarMoeda(lucro);
    
    if (statusElement) {
        if (lucro > 500) {
            statusElement.textContent = "Excelente";
            statusElement.style.color = "#2ecc71";
        } else if (lucro > 0) {
            statusElement.textContent = "Bom";
            statusElement.style.color = "#f39c12";
        } else {
            statusElement.textContent = "Atenção";
            statusElement.style.color = "#e74c3c";
        }
    }

    console.log(`KPIs: Gastos=${formatarMoeda(totalGastos)}, Receita=${formatarMoeda(receitaTotal)}, Lucro=${formatarMoeda(lucro)}`);
}

// Criar todos os gráficos
function criarGraficos() {
    criarGraficoGastos();
    criarGraficoReceita();
    criarGraficoIngressos();
    criarGraficoProdutos();
}

// Gráfico de Gastos
function criarGraficoGastos() {
    const ctx = document.getElementById("detalhamento-Gastos");
    if (!ctx || dadosGastos.length === 0) return;

    if (gastosChart) gastosChart.destroy();

    const labels = dadosGastos.map(gasto => gasto.nome);
    const valores = dadosGastos.map(gasto => parseFloat(gasto.valor));
    const cores = ["#e74c3c", "#3498db", "#f1c40f", "#9b59b6", "#2ecc71", "#e67e22"];

    gastosChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: cores
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "right" },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatarMoeda(context.parsed);
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de Receita
function criarGraficoReceita() {
    const ctx = document.getElementById("detalhamento-Receita");
    if (!ctx) return;

    if (receitaChart) receitaChart.destroy();

    const receitaIngressos = dadosIngressos.reduce((total, ingresso) => 
        total + (parseFloat(ingresso.valor || 0) * parseInt(ingresso.quantidade || 0)), 0);
    const receitaProdutos = dadosProdutos.reduce((total, produto) => 
        total + (parseFloat(produto.valor || 0) * parseInt(produto.quantidade || 0)), 0);

    receitaChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Ingressos", "Produtos"],
            datasets: [{
                data: [receitaIngressos, receitaProdutos],
                backgroundColor: ["#2ecc71", "#1abc9c"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "right" },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatarMoeda(context.parsed);
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de Ingressos
function criarGraficoIngressos() {
    const ctx = document.getElementById("vendas-de-ingresso");
    if (!ctx || dadosIngressos.length === 0) return;

    if (ingressosChart) ingressosChart.destroy();

    const labels = dadosIngressos.map(ingresso => ingresso.nome);
    const vendidos = dadosIngressos.map(ingresso => parseInt(ingresso.quantidade || 0));
    const metas = dadosIngressos.map(ingresso => parseInt(ingresso.meta || 100));

    ingressosChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Vendidos",
                    data: vendidos,
                    backgroundColor: "#8e44ad"
                },
                {
                    label: "Meta",
                    data: metas,
                    backgroundColor: "rgba(200, 200, 200, 0.4)"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Gráfico de Produtos
function criarGraficoProdutos() {
    const ctx = document.getElementById("venda-de-produto");
    if (!ctx || dadosProdutos.length === 0) return;

    if (produtosChart) produtosChart.destroy();

    const labels = dadosProdutos.map(produto => produto.nome);
    const vendidos = dadosProdutos.map(produto => parseInt(produto.quantidade || 0));
    const metas = dadosProdutos.map(produto => parseInt(produto.meta || 25));

    produtosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Meta',
                    data: metas,
                    backgroundColor: 'rgba(200, 200, 200, 0.4)'
                },
                {
                    label: 'Vendidos',
                    data: vendidos,
                    backgroundColor: '#6a0dad'
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: { beginAtZero: true }
            }
        }
    });
}

// Formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor || 0);
}

// Função para testar manualmente
function testarConexao() {
    const evento_id = sessionStorage.getItem("evento_id");
    if (evento_id) {
        carregarDados(evento_id);
    } else {
        console.log("Defina um ID de evento primeiro: sessionStorage.setItem('evento_id', '3')");
    }
}