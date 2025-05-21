const { json } = require("express");

function criar_evento() {
    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const capacidade = document.getElementById("capacidade").value;
    const lucro = document.getElementById("lucro").value;
    const local = document.getElementById("local").value;
    const organizador_id = JSON.parse(sessionStorage.getItem("dados_usuarios"))[0].id;
    console.log("organizador teste teste", organizador_id);
    

    if (!nome || !data || !capacidade || !lucro) {
        alert("Preencha todos os campos!");
        return false;
    }

    const dados = {
        organizador_id: organizador_id,
        nome: nome,
        data: data,
        local: local,
        meta_receita: capacidade * lucro,
        meta_lucro: lucro
    };

    console.log("Dados do evento:", dados);

    fetch("/evento/criar_evento", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar evento!");
        }
        return resposta.json();
    })
    .then(resposta => {
        console.log("Resposta do servidor:", resposta);
        const evento_id = resposta.evento_id;
        sessionStorage.setItem("evento_id", evento_id);
        alert("Evento cadastrado com sucesso! ID: " + evento_id);
        window.location.href = "gastos-do-evento.html";
    })
    .catch(erro => {
        console.error("Erro:", erro);
        alert("Erro ao cadastrar evento. Por favor, tente novamente.");
    });

    return false;
}
