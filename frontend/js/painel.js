const URL = "https://gaby-essennce-production.up.railway.app";

document.addEventListener('DOMContentLoaded', function() {
    // Função para mostrar mensagens
    function showMessage(message, type = 'success') {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        const form = document.getElementById('trabalhoForm');
        form.parentNode.insertBefore(messageDiv, form);

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 4500);
    }

    // Função para mostrar loading
    function showLoading(button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Processando...';
    }

    // Função para esconder loading
    function hideLoading(button, text) {
        button.disabled = false;
        button.innerHTML = text;
    }

    // Função para buscar trabalhos do backend
    async function fetchTrabalhos() {
        try {
            const response = await fetch(`${URL}/trabalhos`);
            if (!response.ok) throw new Error('Erro ao buscar trabalhos');
            const trabalhos = await response.json();
            exibirTrabalhos(trabalhos);
        } catch (error) {
            console.error(error);
            showMessage('Erro ao carregar trabalhos. Tente novamente.', 'error');
        }
    }

    // Função para exibir trabalhos na lista
    function exibirTrabalhos(trabalhos) {
        const lista = document.getElementById('trabalhos-lista');
        lista.innerHTML = '';

        if (trabalhos.length === 0) {
            lista.innerHTML = '<div class="trabalho-item" style="text-align: center; grid-column: 1 / -1;"><p style="color: rgba(255,255,255,0.7);">Nenhum trabalho encontrado. Adicione o primeiro trabalho!</p></div>';
            return;
        }

        trabalhos.forEach((trabalho, index) => {
            const div = document.createElement('div');
            div.classList.add('trabalho-item');
            div.style.animationDelay = `${index * 0.1}s`;

            // Ajuste: carregar imagem do servidor
            const imageUrl = trabalho.image ? `${URL}/img/${trabalho.image}` : '';

            div.innerHTML = `
                <h4>${trabalho.titulo}</h4>
                <p>${trabalho.descricao}</p>
                ${imageUrl ? `<img src="${imageUrl}" alt="${trabalho.titulo}" />` : ''}
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button data-id="${trabalho.id}" class="editar-btn">✏️ Editar</button>
                    <button data-id="${trabalho.id}" class="deletar-btn">🗑️ Excluir</button>
                </div>
            `;
            lista.appendChild(div);
        });
        adicionarEventosBotoes();
    }

    // Função para adicionar eventos aos botões editar e excluir
    function adicionarEventosBotoes() {
        document.querySelectorAll('.deletar-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');

                if (confirm('🗑️ Tem certeza que deseja excluir este trabalho?\n\nEsta ação não pode ser desfeita.')) {
                    try {
                        const response = await fetch(`${URL}/trabalho/${id}`, {
                            method: 'DELETE'
                        });
                        if (response.status === 404) {
                            showMessage('⚠️ Trabalho não encontrado. Talvez já tenha sido deletado.', 'error');
                            fetchTrabalhos();
                            return;
                        }
                        if (!response.ok) throw new Error('Erro ao deletar trabalho');

                        showMessage('✅ Trabalho deletado com sucesso!');
                        fetchTrabalhos();
                    } catch (error) {
                        console.error(error);
                        showMessage('❌ Erro ao deletar trabalho. Tente novamente.', 'error');
                    }
                }
            });
        });

        document.querySelectorAll('.editar-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');

                try {
                    const response = await fetch(`${URL}/trabalho/${id}`);
                    if (!response.ok) throw new Error('Erro ao buscar trabalho');
                    const trabalho = await response.json();
                    preencherFormulario(trabalho);
                    editarId = id;

                    document.getElementById('novo-trabalho-form').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    showMessage('📝 Modo de edição ativado. Faça as alterações e salve.');
                } catch (error) {
                    console.error(error);
                    showMessage('❌ Erro ao carregar dados do trabalho.', 'error');
                }
            });
        });
    }

    let editarId = null;

    function preencherFormulario(trabalho) {
        document.getElementById('titulo').value = trabalho.titulo;
        document.getElementById('descricao').value = trabalho.descricao;
        // Imagem não será preenchida automaticamente

        const submitBtn = document.querySelector('#trabalhoForm button[type="submit"]');
        submitBtn.textContent = '💾 Atualizar Trabalho';

        if (!document.getElementById('cancelar-btn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.id = 'cancelar-btn';
            cancelBtn.textContent = '❌ Cancelar';
            cancelBtn.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
            cancelBtn.style.marginTop = '10px';
            cancelBtn.onclick = cancelarEdicao;

            submitBtn.parentNode.appendChild(cancelBtn);
        }
    }

    function cancelarEdicao() {
        editarId = null;
        document.getElementById('trabalhoForm').reset();

        const submitBtn = document.querySelector('#trabalhoForm button[type="submit"]');
        submitBtn.textContent = '➕ Adicionar Trabalho';

        const cancelBtn = document.getElementById('cancelar-btn');
        if (cancelBtn) cancelBtn.remove();

        showMessage('📝 Edição cancelada.');
    }

    // 🚀 Evento submit do formulário (AJUSTADO PARA UPLOAD)
    const form = document.getElementById('trabalhoForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.querySelector('#trabalhoForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        showLoading(submitBtn);

        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const imagem = document.getElementById('imagem').files[0];

        try {
            let response;
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('descricao', descricao);

            if (imagem) {
                formData.append('imagem', imagem);
            }

            if (editarId) {
                response = await fetch(`${URL}/trabalho/${editarId}`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                response = await fetch(`${URL}/trabalhos`, {
                    method: 'POST',
                    body: formData
                });
            }

            if (!response.ok) throw new Error('Erro ao salvar trabalho');

            const successMessage = editarId ? '✅ Trabalho atualizado com sucesso!' : '✅ Trabalho criado com sucesso!';
            showMessage(successMessage);

            form.reset();
            if (editarId) {
                cancelarEdicao();
            }
            fetchTrabalhos();
        } catch (error) {
            console.error(error);
            showMessage('❌ Erro ao salvar trabalho. Verifique os dados e tente novamente.', 'error');
        } finally {
            hideLoading(submitBtn, originalText);
        }
    });

    // Validação em tempo real
    const inputs = document.querySelectorAll('#trabalhoForm input, #trabalhoForm textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#e74c3c';
                this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.3)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.boxShadow = 'none';
            }
        });
    });

    fetchTrabalhos();
});
