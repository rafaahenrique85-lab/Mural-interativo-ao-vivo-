const fotoA = document.getElementById("fotoA");
const fotoB = document.getElementById("fotoB");
const miniaturasDireita = document.getElementById("miniaturasDireita");
const novo = document.getElementById("novo");
const telaEspera = document.getElementById("telaEspera");
const btnTelaCheia = document.getElementById("btnTelaCheia");

let fotos = [];
let fila = [];

let exibindo = false;
let indiceAtual = -1;
let fotoAtual = fotoA;
let fotoOculta = fotoB;
let tempoExibicao = 8;

function mostrarFoto(nomeArquivo) {

    fotoOculta.onload = () => {

        fotoOculta.onload = null;

        fotoOculta.style.transform = "scale(1)";
        fotoOculta.style.opacity = "0";

        requestAnimationFrame(() => {

            fotoOculta.classList.remove("foto-inativa");
            fotoOculta.classList.add("foto-ativa");

            fotoAtual.classList.remove("foto-ativa");
            fotoAtual.classList.add("foto-inativa");

            fotoOculta.style.opacity = "1";
            fotoAtual.style.opacity = "0";

            requestAnimationFrame(() => {
                fotoOculta.style.transform = "scale(1.08)";
            });

            const temp = fotoAtual;
            fotoAtual = fotoOculta;
            fotoOculta = temp;

        });

    };

    fotoOculta.src = "/uploads/" + nomeArquivo + "?t=" + Date.now();

}

async function carregarConfiguracaoEvento() {

    try {

        const resposta = await fetch("/evento");
        const evento = await resposta.json();

        if (evento.tempo) {
            tempoExibicao = Number(evento.tempo);
        }

    } catch (erro) {

        console.error("Erro ao carregar configuração do evento:", erro);

    }

}

async function carregarFotos() {

    try {

  const resposta = await fetch("/fotos");
const lista = await resposta.json();

if (telaEspera) {
    telaEspera.style.display = lista.length === 0 ? "flex" : "none";
}

if (!Array.isArray(lista)) return;

        lista.sort();

        lista.forEach(foto => {

            if (!fotos.includes(foto)) {

                fotos.push(foto);

                if (indiceAtual >= 0) {
                    fila.push(foto);
                }

            }

        });

        atualizarMiniaturas();

        if (indiceAtual === -1 && fotos.length > 0) {

            indiceAtual = 0;

            mostrarFoto(fotos[0]);

            iniciarFila();

        }

    } catch (erro) {

        console.error("Erro ao carregar fotos:", erro);

    }

}
function atualizarMiniaturas() {

    if (!miniaturasDireita) return;

    miniaturasDireita.innerHTML = "";

    [...fotos].reverse().forEach(foto => {

        const img = document.createElement("img");

        img.src = "/uploads/" + foto + "?t=" + Date.now();

        img.onclick = () => {

            mostrarFoto(foto);

        };

        miniaturasDireita.appendChild(img);

    });

}
function iniciarFila() {

    if (exibindo) return;

    exibindo = true;

    setInterval(() => {

        if (fila.length > 0) {

            const foto = fila.shift();

            mostrarFoto(foto);

  if (novo) {

    novo.classList.remove("esconder");
    novo.classList.add("mostrar");

    setTimeout(() => {

        novo.classList.remove("mostrar");
        novo.classList.add("esconder");

    }, 3000);

}

return;

        }

        if (fotos.length === 0) return;

        indiceAtual++;

        if (indiceAtual >= fotos.length) {

            indiceAtual = 0;

        }

        mostrarFoto(fotos[indiceAtual]);

    }, tempoExibicao * 1000);

}

(async () => {

    await carregarConfiguracaoEvento();

    carregarFotos();

    setInterval(() => {

        carregarFotos();

    }, 3000);

})();

if (btnTelaCheia) {
    btnTelaCheia.addEventListener("click", async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    });
}