localStorage.removeItem('elvora_atendimento');
localStorage.removeItem('servico_nome');
localStorage.removeItem('servico_preco');

const ATENDIMENTO_KEY = 'elvora_atendimento';

function carregarAtendimento() {
    return JSON.parse(localStorage.getItem(ATENDIMENTO_KEY)) || {};
}

function salvarAtendimento(atendimento) {
    localStorage.setItem(ATENDIMENTO_KEY, JSON.stringify(atendimento));
}

function escolherServico(nome, preco) {
    const atendimento = carregarAtendimento();

    salvarAtendimento({
        ...atendimento,
        servico: nome,
        preco: preco,
        duracao: '60 minutos'
    });

    // Mantem compatibilidade com a pagina antiga de pagamento.
    localStorage.setItem('servico_nome', nome);
    localStorage.setItem('servico_preco', preco);
}
