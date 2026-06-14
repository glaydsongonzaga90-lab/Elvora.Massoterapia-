const ATENDIMENTO_KEY = 'elvora_atendimento';

function carregarAtendimento() {
    return JSON.parse(localStorage.getItem(ATENDIMENTO_KEY)) || {};
}

function formatarLista(itens) {
    return Array.isArray(itens) && itens.length ? itens.join(', ') : 'Nao informado';
}

const atendimento = carregarAtendimento();
const cliente = atendimento.cliente || {};
const resumo = document.getElementById('resumoAtendimento');
const whatsappLink = document.getElementById('https://wa.me/5531997911314');

const servico = atendimento.servico || 'Servico nao informado';
const preco = atendimento.preco ? `R$ ${atendimento.preco}` : 'Preco nao informado';
const nome = cliente.nome || 'Nome nao informado';
const telefone = cliente.telefone || 'Telefone nao informado';
const areas = formatarLista(cliente.mapaCorporal);

resumo.innerHTML = `
    <strong>Servico:</strong> ${servico}<br>
    <strong>Valor:</strong> ${preco}<br>
    <strong>Cliente:</strong> ${nome}<br>
    <strong>Telefone:</strong> ${telefone}<br>
    <strong>Areas selecionadas:</strong> ${areas}
`;

const mensagem = [
    'Ola, gostaria de solicitar meu agendamento na ELVORA.',
    `Servico: ${servico}`,
    `Valor: ${preco}`,
    `Nome: ${nome}`,
    `Telefone: ${telefone}`,
    `Areas selecionadas: ${areas}`,
    'Estou ciente de que o agendamento sera confirmado por telefone.'
].join('\n');

whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
