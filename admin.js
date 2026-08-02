const btnCriarEvento = document.getElementById("btnCriarEvento");
const formEvento = document.getElementById("formEvento");

const btnSalvarEvento = document.getElementById("btnSalvarEvento");
const btnEditarEvento = document.getElementById("btnEditarEvento");
const btnEncerrarEvento = document.getElementById("btnEncerrarEvento");

const acoesEvento = document.getElementById("acoesEvento");
const eventoNome = document.getElementById("eventoNome");
const eventoModo = document.getElementById("eventoModo");
const eventoTempo = document.getElementById("eventoTempo");
const btnAbrirMural = document.getElementById("btnAbrirMural");
const btnPaginaEnvio = document.getElementById("btnPaginaEnvio");

btnCriarEvento.addEventListener("click", () => {
    formEvento.style.display = "block";
});

btnSalvarEvento.addEventListener("click", () => {

    const nome = document.getElementById("nomeEvento").value;

    const modo = document.querySelector('input[name="aprovacao"]:checked').value;

    const tempo = document.getElementById("tempoEvento").value;

    fetch("/evento", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            modo,
            tempo
        })
    });

    eventoNome.textContent = nome || "Evento sem nome";
    eventoModo.textContent = "Modo: " + modo;
    eventoTempo.textContent = "Tempo de exibição: " + tempo + " segundos";

    formEvento.style.display = "none";

    btnCriarEvento.style.display = "none";
    acoesEvento.style.display = "block";

});

btnEditarEvento.addEventListener("click", () => {

    document.getElementById("nomeEvento").value = eventoNome.textContent;

    document.getElementById("tempoEvento").value =
        parseInt(eventoTempo.textContent);

    if (eventoModo.textContent.includes("manual")) {
        document.querySelector('input[value="manual"]').checked = true;
    } else {
        document.querySelector('input[value="automatico"]').checked = true;
    }

    formEvento.style.display = "block";

});

btnEncerrarEvento.addEventListener("click", () => {

    if (!confirm("Tem certeza que deseja encerrar o evento?")) {
        return;
    }

    fetch("/encerrar-evento", {
        method: "POST"
    })
    .then(res => res.json())
    .then(() => {

        eventoNome.textContent = "Nenhum evento ativo";
        eventoModo.textContent = "";
        eventoTempo.textContent = "";

        document.getElementById("nomeEvento").value = "";
        document.getElementById("tempoEvento").value = 8;
        document.querySelector('input[value="automatico"]').checked = true;

        acoesEvento.style.display = "none";
        btnCriarEvento.style.display = "block";

        alert("Evento encerrado com sucesso!");

    });

});

btnAbrirMural.addEventListener("click", () => {
    window.open("http://localhost:3000/mural.html", "_blank");
    });
    
    btnPaginaEnvio.addEventListener("click", () => {
    window.open("http://localhost:3000/upload.html", "_blank");
});
// ===== FILA DE APROVAÇÃO =====

const listaPendentes = document.getElementById("listaPendentes");

function carregarPendentes() {

    fetch("/pendentes")
        .then(res => res.json())
        .then(fotos => {

            listaPendentes.innerHTML = "";

            if (fotos.length === 0) {

                listaPendentes.innerHTML =
                    "<p>Nenhuma foto aguardando aprovação.</p>";

                return;
            }

            fotos.forEach((foto, indice) => {

                listaPendentes.innerHTML += `
                    <div class="foto-pendente">

                        <h4>Fila ${indice + 1}</h4>

                        <img
                            src="/pendentes/${foto}?t=${Date.now()}"
                            class="miniatura-pendente"
                        >

                        <p>${foto}</p>

                        <button onclick="aprovarFoto('${foto}')">
                            ✅ Aprovar
                        </button>

                        <button onclick="rejeitarFoto('${foto}')">
                            ❌ Rejeitar
                        </button>

                    </div>
                `;

            });

        });

}

carregarPendentes();

setInterval(carregarPendentes, 3000);

function aprovarFoto(foto) {

    fetch("/aprovar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ foto })
    })
    .then(res => res.json())
    .then(() => {
        location.reload();
    });

}

function rejeitarFoto(foto) {

    fetch("/rejeitar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ foto })
    })
    .then(res => res.json())
    .then(() => {
        location.reload();
    });

}

fetch("/evento")
    .then(res => res.json())
    .then(evento => {

        if (!evento.nome) return;

        eventoNome.textContent = evento.nome;
        eventoModo.textContent = "Modo: " + evento.modo;
        eventoTempo.textContent = "Tempo de exibição: " + evento.tempo + " segundos";

        document.getElementById("nomeEvento").value = evento.nome;
        document.getElementById("tempoEvento").value = evento.tempo;

document.querySelector('input[value="' + 
    evento.modo + '"]').checked = true;

        btnCriarEvento.style.display = "none";
        acoesEvento.style.display = "block";

    });