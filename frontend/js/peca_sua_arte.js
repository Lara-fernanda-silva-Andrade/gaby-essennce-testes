// Aguarda o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', function() {

  // --- CONTROLE DO MODAL ---
  const modal = document.getElementById('pedidoModal');
  const btnAbrir = document.getElementById('abrirModalBtn');
  const btnFechar = document.querySelector('.close-btn');
  const form = document.getElementById('pedidoForm');

  // Verifica se todos os elementos necessários existem na página
  if (!modal || !btnAbrir || !btnFechar || !form) {
    console.error("Erro crítico: Elementos do modal não foram encontrados no HTML.");
    return; // Para a execução para evitar mais erros
  }

  // Evento para ABRIR o modal
  btnAbrir.onclick = function() {
    modal.style.display = "flex";
  }

  // Evento para FECHAR o modal pelo botão 'x'
  btnFechar.onclick = function() {
    modal.style.display = "none";
  }

  // Evento para FECHAR o modal clicando fora da área de conteúdo
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // --- LÓGICA DO FORMULÁRIO ---
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio e recarregamento da página

    // Coleta os dados do formulário
    const titulo = document.getElementById('titulo').value;
    const tipo = document.getElementById('tipo').value;
    const formato = document.getElementById('formato').value;
    const descricao = document.getElementById('descricao').value;
    const dataEntrega = document.getElementById('dataEntrega').value;

    // Validação simples para garantir que os campos não estão vazios
    if (!titulo || !tipo || !formato || !descricao || !dataEntrega) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    // Cria um objeto com os dados do novo pedido
    const novoPedido = {
      id: Date.now(), // Adiciona um ID único baseado na data/hora
      titulo,
      tipo,
      formato,
      descricao,
      dataEntrega,
      status: 'Pendente' // Status inicial do pedido
    };

    // Pega os pedidos já existentes do localStorage ou cria um array vazio
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido); // Adiciona o novo pedido
    localStorage.setItem('pedidos', JSON.stringify(pedidos)); // Salva de volta no localStorage

    // Feedback para o usuário
    alert('Pedido realizado com sucesso!');

    // Fecha o modal e limpa o formulário
    modal.style.display = "none";
    form.reset();

    // Opcional: Redireciona para a página de "Meus Pedidos" após um pequeno atraso
    setTimeout(() => {
      window.location.href = 'meus_pedidos.html';
    }, 500); // Atraso de meio segundo
  });

});