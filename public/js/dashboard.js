let dadosGastos = [];
let dadosIngressos = [];
let dadosProdutos = [];
let gastosChart = null;
let receitaChart = null;
let ingressosChart = null;
let produtosChart = null;

// Carregar dados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const evento_id = urlParams.get("id");
    console.log("ID do evento:", evento_id);

    if (evento_id) {
        carregarDados(evento_id);
    } else {
        console.error("ID do evento não encontrado");
    }
});

// Função principal para carregar dados
async function carregarDados(evento_id) {
    await carregarEventoInfo(evento_id);
    await carregarGastos(evento_id);
    await carregarIngressos(evento_id);
    await carregarProdutos(evento_id);

    atualizarKPIs();
    criarGraficos();
}

// Carregar nome/data do evento (opcional, se tiver endpoint)
async function carregarEventoInfo(evento_id) {
    try {
        const response = await fetch(`/evento/buscar_evento/${evento_id}`);
        if (response.ok) {
            const evento = await response.json();
            document.getElementById("evento-nome-data").textContent =
                `${evento.nome || "Evento"} - ${evento.data ? new Date(evento.data).toLocaleDateString('pt-BR') : ""}`;
        }
    } catch (e) {
        document.getElementById("evento-nome-data").textContent = "";
    }
}

// Carregar gastos
async function carregarGastos(evento_id) {
    try {
        const response = await fetch(`/gasto/buscar_gastos/${evento_id}`);
        if (response.ok) {
            dadosGastos = await response.json();
        } else {
            dadosGastos = [];
        }
    } catch (error) {
        dadosGastos = [];
    }
}

// Carregar ingressos
async function carregarIngressos(evento_id) {
    try {
        const response = await fetch(`/ingressos/buscar_ingressos/${evento_id}`);
        if (response.ok) {
            dadosIngressos = await response.json();
        } else {
            dadosIngressos = [];
        }
    } catch (error) {
        dadosIngressos = [];
    }
}

// Carregar produtos
async function carregarProdutos(evento_id) {
    try {
        const response = await fetch(`/produtos/buscar_produtos/${evento_id}`);
        if (response.ok) {
            dadosProdutos = await response.json();
        } else {
            dadosProdutos = [];
        }
    } catch (error) {
        dadosProdutos = [];
    }
}

// Atualizar KPIs com dados reais
function atualizarKPIs() {
    const totalGastos = dadosGastos.reduce((total, gasto) => total + parseFloat(gasto.valor || 0), 0);
    const receitaIngressos = dadosIngressos.reduce((total, ingresso) =>
        total + (parseFloat(ingresso.preco || 0) * parseInt(ingresso.vendido || 0)), 0);
    const receitaProdutos = dadosProdutos.reduce((total, produto) =>
        total + (parseFloat(produto.valor || 0) * parseInt(produto.quantidade || 0)), 0);
    const receitaTotal = receitaIngressos + receitaProdutos;
    const lucro = receitaTotal - totalGastos;

    // Buscar meta de lucro do evento (meta_lucro ou lucro_desejado)
    let metaLucro = 0;
    if (window.eventoInfo && (window.eventoInfo.meta_lucro || window.eventoInfo.lucro_desejado)) {
        metaLucro = parseFloat(window.eventoInfo.meta_lucro || window.eventoInfo.lucro_desejado || 0);
    } else if (dadosIngressos.length > 0 && dadosIngressos[0].evento_meta_lucro) {
        metaLucro = parseFloat(dadosIngressos[0].evento_meta_lucro);
    }

    const gastoElement = document.querySelector('.kpi:nth-child(1) .dinheiro');
    const receitaElement = document.querySelector('.kpi:nth-child(2) .dinheiro');
    const lucroElement = document.querySelector('.kpi:nth-child(4) .dinheiro');
    const statusElement = document.querySelector('.kpi:nth-child(3) p');

    if (gastoElement) gastoElement.textContent = formatarMoeda(totalGastos);
    if (receitaElement) receitaElement.textContent = formatarMoeda(receitaTotal);
    if (lucroElement) lucroElement.textContent = formatarMoeda(lucro);

    // Status baseado na meta
    if (statusElement) {
        if (metaLucro > 0) {
            const percentual = (lucro / metaLucro) * 100;
            if (percentual >= 100) {
                statusElement.textContent = `Excelente! Meta atingida (${percentual.toFixed(0)}%)`;
                statusElement.style.color = "#2ecc71";
            } else if (percentual >= 80) {
                statusElement.textContent = `Quase lá! (${percentual.toFixed(0)}% da meta)`;
                statusElement.style.color = "#f39c12";
            } else if (percentual > 0) {
                statusElement.textContent = `Abaixo da meta (${percentual.toFixed(0)}%)`;
                statusElement.style.color = "#e67e22";
            } else {
                statusElement.textContent = "Prejuízo";
                statusElement.style.color = "#e74c3c";
            }
        } else {
            // Caso não tenha meta definida
            if (lucro > 0) {
                statusElement.textContent = "Lucro";
                statusElement.style.color = "#2ecc71";
            } else {
                statusElement.textContent = "Prejuízo";
                statusElement.style.color = "#e74c3c";
            }
        }
    }
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
    const cores = [
        '#cb4cdc', '#9c1fa8', '#7b1988', '#560c67', '#3d0045', '#2a0033'
    ];

    gastosChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: cores,
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#cb4cdc',
                    bodyColor: '#ffffff',
                    borderColor: '#cb4cdc',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatarMoeda(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#fff' } },
                y: { beginAtZero: true, ticks: { color: '#fff' } }
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
        total + (parseFloat(ingresso.preco || 0) * parseInt(ingresso.vendido || 0)), 0);
    const receitaProdutos = dadosProdutos.reduce((total, produto) =>
        total + (parseFloat(produto.valor || 0) * parseInt(produto.quantidade || 0)), 0);

    receitaChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Ingressos", "Produtos"],
            datasets: [{
                data: [receitaIngressos, receitaProdutos],
                backgroundColor: ['#e940ff', '#cb4cdc'],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#cb4cdc',
                    bodyColor: '#ffffff',
                    borderColor: '#cb4cdc',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatarMoeda(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#fff' } },
                y: { beginAtZero: true, ticks: { color: '#fff' } }
            }
        }
    });
}

// Gráfico de Ingressos
function criarGraficoIngressos() {
    const ctx = document.getElementById("vendas-de-ingresso");
    if (!ctx || dadosIngressos.length === 0) return;

    if (ingressosChart) ingressosChart.destroy();

    const labels = dadosIngressos.map(ingresso => ingresso.tipo || ingresso.nome);
    const vendidos = dadosIngressos.map(ingresso => parseInt(ingresso.vendido || ingresso.quantidade || 0));
    const metas = dadosIngressos.map(ingresso => parseInt(ingresso.meta || 0));
    const cores = [
        '#cb4cdc', '#9c1fa8', '#7b1988', '#560c67', '#3d0045'
    ];

    ingressosChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Vendidos",
                    data: vendidos,
                    backgroundColor: cores,
                    borderColor: '#ffffff',
                    borderWidth: 1
                },
                {
                    label: "Meta",
                    data: metas,
                    backgroundColor: 'rgba(200, 200, 200, 0.4)',
                    borderColor: '#ffffff',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#cb4cdc',
                    bodyColor: '#ffffff',
                    borderColor: '#cb4cdc',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#fff' } },
                y: { beginAtZero: true, ticks: { color: '#fff' } }
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
    const metas = dadosProdutos.map(produto => parseInt(produto.meta || 0));
    const cores = [
        '#e940ff', '#cb4cdc', '#9c1fa8', '#7b1988', '#560c67', '#3d0045'
    ];

    produtosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Vendidos',
                    data: vendidos,
                    backgroundColor: cores,
                    borderColor: '#ffffff',
                    borderWidth: 1
                },
                {
                    label: 'Meta',
                    data: metas,
                    backgroundColor: 'rgba(200, 200, 200, 0.4)',
                    borderColor: '#ffffff',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#cb4cdc',
                    bodyColor: '#ffffff',
                    borderColor: '#cb4cdc',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#fff' } },
                y: { beginAtZero: true, ticks: { color: '#fff' } }
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