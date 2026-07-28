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

btnEncerrarEvento.addEventListener("click", () => {

    eventoNome.textContent = "Nenhum evento ativo";
    eventoModo.textContent = "";
    eventoTempo.textContent = "";

    document.getElementById("nomeEvento").value = "";
    document.getElementById("tempoEvento").value = 8;
    document.querySelector('input[value="automatico"]').checked = true;

    acoesEvento.style.display = "none";
    btnCriarEvento.style.display = "block";

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
btnAbrirMural.addEventListener("click", () => {
    window.open("http://localhost:3000/mural.html", "_blank");
    });
    btnPaginaEnvio.addEventListener("click", () => {
    window.open("http://localhost:3000/upload.html", "_blank");
});
// ===== FILA DE APROVAÇÃO =====

const listaPendentes = document.getElementById("listaPendentes");

fetch("/pendentes")
    .then(res => res.json())
    .then(fotos => {

        listaPendentes.innerHTML = "";

        if (fotos.length === 0) {

            listaPendentes.innerHTML =
                "<p>Nenhuma foto aguardando aprovação.</p>";

            return;
        }

        fotos.forEach(foto => {

            listaPendentes.innerHTML += `
                <div class="foto-pendente">

                    <p>📷 ${foto}</p>

                    <button onclick="aprovarFoto('${foto}')">✅ Aprovar</button>

                    <button onclick="rejeitarFoto('${foto}')">❌ Rejeitar</button>

                </div>
            `;

        });

    });

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