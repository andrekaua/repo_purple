function entrar() {
    const email = document.getElementById("Email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const most = document.getElementById("most");

    // Resetar mensagem
    most.style.display = "rgb(156, 156, 156)";
    most.style.color = "red";
    most.innerHTML = "";

    // Validação dos campos
    if (!email || !senha) {
        most.innerHTML = "Por favor, preencha todos os campos.";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        most.innerHTML = "Por favor, insira um email válido.";
        return;
    }

    if (senha.length < 6) {
        most.innerHTML = "A senha deve ter pelo menos 6 caracteres.";
        return;
    }

    // Mostrar "Carregando..."
    most.style.color = "black";
    most.innerHTML = "Carregando...";

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(async function (resposta) {
        if (resposta.ok) {
            const dados_usuario = await resposta.json();
            // Salva o id do usuário como organizador_id
            sessionStorage.setItem("dados_usuarios", JSON.stringify(dados_usuario));
            console.log("miguel gay", dados_usuario);

            most.style.color = "rgba(0, 255, 47, 0.691)";
            most.innerHTML = "Login bem-sucedido! Redirecionando...";
            
            setTimeout(function () {
                window.location = "criar-evento.html";
        }, 1000);
        } else {
            return resposta.text().then(texto => {
                throw new Error(texto);
            });
        }
    })
    .catch(function (erro) {
        most.style.color = "red";
        most.innerHTML = "Email ou senha incorretos.";
        console.error("Erro no login:", erro.message);
    });
}