const btnCriarEvento = document.getElementById("btnCriarEvento");
const formEvento = document.getElementById("formEvento");

const btnSalvarEvento = document.getElementById("btnSalvarEvento");

const eventoNome = document.getElementById("eventoNome");
const eventoModo = document.getElementById("eventoModo");
const eventoTempo = document.getElementById("eventoTempo");

btnCriarEvento.addEventListener("click", () => {
    formEvento.style.display = "block";
});

btnSalvarEvento.addEventListener("click", () => {

    const nome = document.getElementById("nomeEvento").value;

    const modo = document.querySelector('input[name="aprovacao"]:checked').value;

    const tempo = document.getElementById("tempoEvento").value;

    eventoNome.textContent = nome || "Evento sem nome";
    eventoModo.textContent = "Modo: " + modo;
    eventoTempo.textContent = "Tempo de exibição: " + tempo + " segundos";

    formEvento.style.display = "none";

});