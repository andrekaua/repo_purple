function atualizarLabelDocumento() {
    const tipo = document.getElementById("tipo_documento").value;
    const label = document.getElementById("label_documento");
    label.innerText = tipo === "cnpj" ? "CNPJ:" : tipo === "cpf" ? "CPF:" : "Documento:";
}

function cadastrar() {
    const tipo = document.getElementById("tipo_documento").value;
    const documento = document.getElementById("documento").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar_senha").value;
    const mensagem = document.getElementById("most");

    const exibirErro = (mensagemErro) => {
        mensagem.innerHTML = mensagemErro;
    };

    if (!tipo || !documento || !nome || !email || !telefone || !senha || !confirmarSenha) {
        exibirErro("Preencha todos os campos obrigatórios.");
        return;
    }

    if (nome.length < 3) {
        exibirErro("O nome deve ter pelo menos 3 caracteres.");
        return;
    }

    if (!/^[A-Z][a-záéíóúãõâêîôûç]+ [A-Z][a-záéíóúãõâêîôûç]+$/.test(nome)) {
        exibirErro("Digite um nome e sobrenome válidos, com letras maiúsculas no início.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        exibirErro("E-mail inválido.");
        return;
    }

    if (tipo === "cnpj" && (!/^\d{14}$/.test(documento))) {
        exibirErro("CNPJ deve conter exatamente 14 números.");
        return;
    }

    if (tipo === "cpf" && (!/^\d{11}$/.test(documento))) {
        exibirErro("CPF deve conter exatamente 11 números.");
        return;
    }

    if (!/^\d{10,}$/.test(telefone)) {
        exibirErro("Telefone inválido. Deve conter pelo menos 10 números.");
        return;
    }

    if (senha.length < 6) {
        exibirErro("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmarSenha) {
        exibirErro("As senhas não coincidem.");
        return;
    }

    const body = {
        documento: documento,
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha
    };

    console.log("JSON enviado:", JSON.stringify(body));
    
    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
            mensagem.style.color = "green";
            mensagem.innerHTML = "Cadastro realizado com sucesso! Redirecionando para tela de Login...";
            setTimeout(() => {
                window.location = "login.html";
            }, 2000);
            limparFormulario();
        } else {
            throw "Houve um erro ao tentar realizar o cadastro!";
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        mensagem.style.color = "red";
        mensagem.innerHTML = "Erro ao cadastrar. Tente novamente.";
    });

    return false;
}

function sumirMensagem() {
    const mensagem = document.getElementById("most");
    mensagem.innerHTML = "";
}
