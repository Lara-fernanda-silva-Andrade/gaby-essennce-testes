document.addEventListener('DOMContentLoaded', function() {
    // Simulação de pedidos no localStorage (exemplo)
    const pedidos = [
        { id: 1, titulo: 'Pintura abstrata', status: 'pendente' },
        { id: 2, titulo: 'Retrato realista', status: 'em andamento' },
        { id: 3, titulo: 'Desenho digital', status: 'concluido' }
    ];

    // Salva os pedidos no localStorage para simulação
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Carrega os pedidos
    const pedidosLista = document.getElementById('pedidos-lista');
    const pedidosArmazenados = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidosArmazenados.forEach(pedido => {
        const pedidoElement = document.createElement('div');
        pedidoElement.classList.add('pedido-item');
        
        pedidoElement.innerHTML = `
            <span>${pedido.titulo}</span>
            <span class="status ${pedido.status}">${pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
        `;

        pedidosLista.appendChild(pedidoElement);
    });
});
