document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Coleta os dados do formulário
    const titulo = document.getElementById('titulo').value;
    const tipo = document.getElementById('tipo').value;
    const formato = document.getElementById('formato').value;
    const descricao = document.getElementById('descricao').value;
    const dataEntrega = document.getElementById('dataEntrega').value;

    // Validação simples (checar se todos os campos foram preenchidos)
    if (!titulo || !tipo || !formato || !descricao || !dataEntrega) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Simulação do pedido (salva no localStorage)
    const novoPedido = {
        titulo,
        tipo,
        formato,
        descricao,
        dataEntrega,
        status: 'pendente'  // Status inicial do pedido
    };

    // Salva o novo pedido (no localStorage por enquanto)
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Exibe uma mensagem de sucesso
    alert('Pedido realizado com sucesso!');

    // Redireciona para a página "Meus Pedidos"
    window.location.href = 'meus-pedidos.html';
});

// Evento de clique no botão de logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Remove os dados do usuário do localStorage
    localStorage.removeItem('usuario');

    // Redireciona o usuário para a página de login
    window.location.href = 'login.html';
});
