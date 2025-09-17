// JS do modal
const URL = "gaby-essennce-production.up.railway.app"

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("modalLogin");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Validação do formulário de login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    const mensagem = document.getElementById('loginMessage');

    if (email === "teste@exemplo.com" && senha === "123456") {
        mensagem.style.color = "green";
        mensagem.textContent = "Login realizado com sucesso!";
        setTimeout(() => fecharModal('modalLogin'), 1500);
    } else {
        mensagem.style.color = "red";
        mensagem.textContent = "E-mail ou senha incorretos!";
    }
});

document.querySelectorAll(".alternar").forEach(btn => {
  btn.addEventListener("click", () => {
    const login = document.getElementById("modalLogin");
    const cadastro = document.getElementById("modalCadastro");

    if (login.style.display === "flex") {
      login.style.display = "none";
      cadastro.style.display = "flex";
    } else {
      cadastro.style.display = "none";
      login.style.display = "flex";
    }
  });
});

window.addEventListener("dblclick", (event) => {
    const modalLogin = document.getElementById("modalLogin");
    const modalCadastro = document.getElementById("modalCadastro");
  
    // só fecha se o clique duplo for exatamente no fundo escuro do modal
    if (event.target === modalLogin) {
      modalLogin.style.display = "none";
    }
    if (event.target === modalCadastro) {
      modalCadastro.style.display = "none";
    }
  });

  async function cadastrarUsuario() {

    const form = document.getElementById('register');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo = document.getElementById('tipo').value;
  
    if (!nome || !email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    try {
      // Faz a requisição e guarda a resposta
      const response = await fetch(`https://${URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, tipo: 0 })
      });
  
      const resultado = await response.json();
  
      if (!response.ok) throw new Error(resultado.erro || "Erro ao cadastrar conta");
  
      alert('Cadastro realizado com sucesso!');
      fecharModal('modalCadastro');     // fecha o modal
  
    } catch (erro) {
      console.error(erro);
      alert('Falha ao cadastrar conta.');
    }
  }

  async function loginUsuario() {

    

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
  
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
  
    try {
      const response = await fetch(`https://${URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
  
      const resultado = await response.json();
  
      if (!response.ok) throw new Error(resultado.erro || "Email ou senha inválidos");
  
      // <-- Aqui salvamos corretamente no localStorage
      localStorage.setItem("nome", resultado.usuario.nome);

      localStorage.setItem("tipo", resultado.usuario.tipo);
  
      alert('Login realizado com sucesso!');
      fecharModal('modalLogin');
  
      atualizarUserBox();
      atualizarPainel();


    } catch (erro) {
      console.error(erro);
      alert('Falha no login: ' + erro.message);
    }
  }

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex"; // só abre quando clicar
  }

  logoutBtn.addEventListener("click", async () => {
    const userId = localStorage.getItem("userId"); // ou id do usuário logado
    try {
        await fetch(`https://${URL}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId })
        });
    } catch (err) {
        console.error(err);
    }

    localStorage.removeItem("nome");
    localStorage.removeItem("tipo");
    localStorage.removeItem("userId");

    atualizarUserBox();
    atualizarPainel();
    userMenu.classList.remove("show");

    alert("Logout realizado!");
});
