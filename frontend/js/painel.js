document.addEventListener('DOMContentLoaded', function() {
    // Simulação de pedidos no localStorage (exemplo)
    const pedidos = [
        { id: 1, titulo: 'Pintura abstrata', tipo: 'Pintura', formato: 'A4', descricao: 'Uma arte abstrata colorida', status: 'pendente' },
        { id: 2, titulo: 'Retrato realista', tipo: 'Retrato', formato: 'A3', descricao: 'Retrato de uma pessoa em estilo realista', status: 'em andamento' },
        { id: 3, titulo: 'Desenho digital', tipo: 'Desenho', formato: 'A5', descricao: 'Desenho digital de um personagem', status: 'concluido' }
    ];

    // Salva os pedidos no localStorage para simulação
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Carrega os pedidos
    const pedidosLista = document.getElementById('pedidos-lista');
    const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Função para exibir pedidos
    function exibirPedidos(pedidos) {
        pedidosLista.innerHTML = ''; // Limpa a lista antes de adicionar os pedidos

        pedidos.forEach(pedido => {
            const pedidoElement = document.createElement('div');
            pedidoElement.classList.add('pedido-item');
            
            pedidoElement.innerHTML = `
                <div>
                    <h3>${pedido.titulo}</h3>
                    <p><strong>Tipo:</strong> ${pedido.tipo}</p>
                    <p><strong>Formato:</strong> ${pedido.formato}</p>
                    <p><strong>Descrição:</strong> ${pedido.descricao}</p>
                </div>
                <span class="status ${pedido.status}">${pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
                <button onclick="alterarStatus(${pedido.id})">Alterar Status</button>
            `;

            pedidosLista.appendChild(pedidoElement);
        });
    }

    // Exibe todos os pedidos ao carregar a página
    exibirPedidos(pedidosArmazenados);

    // Função para filtrar pedidos por status
    const filtroStatus = document.getElementById('status');
    filtroStatus.addEventListener('change', function() {
        const statusSelecionado = filtroStatus.value;
        const pedidosFiltrados = pedidosArmazenados.filter(pedido => {
            return statusSelecionado === 'todos' || pedido.status === statusSelecionado;
        });
        exibirPedidos(pedidosFiltrados);
    });
});

// Função para alterar o status do pedido
function alterarStatus(id) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    const pedido = pedidos.find(pedido => pedido.id === id);
    
    // Lógica de mudança de status
    if (pedido) {
        if (pedido.status === 'pendente') {
            pedido.status = 'em andamento';
        } else if (pedido.status === 'em andamento') {
            pedido.status = 'concluido';
        } else {
            pedido.status = 'pendente';
        }

        // Salva novamente os pedidos no localStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        // Atualiza a página
        location.reload();
    }
}
