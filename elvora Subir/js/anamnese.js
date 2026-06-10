const ATENDIMENTO_KEY = 'elvora_atendimento';

function carregarAtendimento() {
    return JSON.parse(localStorage.getItem(ATENDIMENTO_KEY)) || {};
}

function salvarAtendimento(atendimento) {
    localStorage.setItem(ATENDIMENTO_KEY, JSON.stringify(atendimento));
}

// --- LOGICA VISUAL ---
window.vistaAtual = 'frente';
let pontosSelecionados = [];

function atualizarImagemCorpo(vista = window.vistaAtual) {
    const genero = document.getElementById('generoSelect').value;
    const img = document.getElementById('imgBoneco');

    if (genero === 'masculino') {
        img.src = vista === 'frente' ? 'Imagem/Corpo masculino frente.png' : 'Imagem/Corpo masculino costas.png';
    } else {
        img.src = vista === 'frente' ? 'Imagem/Corpo feminino frente.png' : 'Imagem/Corpo feminino Costas.png';
    }
}

function trocarVista(vista) {
    window.vistaAtual = vista;

    document.getElementById('btnFrente').classList.toggle('active', vista === 'frente');
    document.getElementById('btnCostas').classList.toggle('active', vista === 'costas');

    document.querySelectorAll('.hotspot.frente').forEach(p => {
        p.style.display = vista === 'frente' ? 'flex' : 'none';
    });

    document.querySelectorAll('.hotspot.costas').forEach(p => {
        p.style.display = vista === 'costas' ? 'flex' : 'none';
    });

    atualizarImagemCorpo(window.vistaAtual);
}

function togglePonto(elemento) {
    elemento.classList.toggle('selected');
    const area = elemento.getAttribute('data-area');
    const lado = elemento.getAttribute('data-side') || "";
    const identificador = `${area} ${lado}`.trim();

    if (elemento.classList.contains('selected')) {
        pontosSelecionados.push(identificador);
    } else {
        pontosSelecionados = pontosSelecionados.filter(item => item !== identificador);
    }

    document.getElementById('areaSelecionada').innerText = "Areas marcadas: " + pontosSelecionados.join(", ");
}

// --- ENVIO PARA O GOOGLE SHEETS ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbzhIjxDFc2XuHnvQD9ID98FVLaudVVnSgSV1yAdQOUfXFX8I4UHiQRnHh-WB2V5h8xKLw/exec';
const form = document.getElementById('anamneseForm');
const atendimentoInicial = carregarAtendimento();

if (!atendimentoInicial.servico || !atendimentoInicial.preco) {
    alert('Escolha um servico antes de preencher a anamnese.');
    window.location.href = 'index.html#servicos';
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const condicoesMarcadas = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        condicoesMarcadas.push(cb.parentElement.innerText.trim());
    });

    const formData = new FormData(form);
    const atendimentoAtual = carregarAtendimento();

    const cliente = {
        nome: formData.get('nome') || '',
        genero: formData.get('genero') || '',
        email: formData.get('email') || '',
        telefone: formData.get('telefone') || '',
        idade: formData.get('idade') || '',
        condicaoMedica: formData.get('condicao_medica') || '',
        descricaoCondicaoMedica: formData.get('descricao_condicao_medica') || '',
        gravidez: formData.get('gravidez') || '',
        alergias: formData.get('alergias') || '',
        condicoes: condicoesMarcadas,
        mapaCorporal: pontosSelecionados
    };

    formData.append('condicoes', condicoesMarcadas.join(", "));
    formData.append('mapa_corporal', pontosSelecionados.join(", "));

    salvarAtendimento({
        ...atendimentoAtual,
        cliente: cliente
    });

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(() => {
        alert('Ficha salva com sucesso!');
        window.location.href = 'Confirmacao.html';
    })
    .catch(() => {
        alert('Nao foi possivel salvar na planilha, mas seus dados ficaram registrados no navegador para envio pelo WhatsApp.');
        window.location.href = 'Confirmacao.html';
    });
});
