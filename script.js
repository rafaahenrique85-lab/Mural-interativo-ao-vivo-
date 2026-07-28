const fotoPrincipal = document.getElementById("fotoPrincipal");
const miniaturasDireita = document.getElementById("miniaturasDireita");
const novo = document.getElementById("novo");

let fotos = [];
let fila = [];
let exibindo = false;
let indiceAtual = -1;
function mostrarFoto(nomeArquivo) {

    const img = new Image();

    img.onload = () => {
        fotoPrincipal.src = img.src;
    };

    img.src = "/uploads/" + nomeArquivo + "?t=" + Date.now();

}
// Carrega as fotos do servidor
async function carregarFotos() {

    try {

        const resposta = await fetch("/fotos");
        let lista = await resposta.json();

        if (!Array.isArray(lista)) return;

        // Ordena da mais antiga para a mais nova
        lista.sort();

        lista.forEach(foto => {

            if (!fotos.includes(foto)) {

                fotos.push(foto);

                // Só entra na fila depois da primeira inicialização
                if (indiceAtual >= 0) {
                    fila.push(foto);
                }

            }

        });

        atualizarMiniaturas();

        // Primeira foto
        if (indiceAtual === -1 && fotos.length > 0) {

            indiceAtual = 0;
            mostrarFoto(fotos[0]);

            iniciarFila();

        }

    } catch (erro) {

        console.error("Erro ao carregar fotos:", erro);

    }

}

// Atualiza miniaturas
function atualizarMiniaturas() {

    if (!miniaturasDireita) return;

    miniaturasDireita.innerHTML = "";

    [...fotos].reverse().forEach(foto => {

        const img = document.createElement("img");

        img.src = "/uploads/" + foto;

        img.onclick = () => {

            fotoPrincipal.src = img.src;

        };

        miniaturasDireita.appendChild(img);

    });

}

// Exibição automática
function iniciarFila() {

    if (exibindo) return;

    exibindo = true;

    setInterval(() => {

        // Fotos novas têm prioridade
        if (fila.length > 0) {

            const foto = fila.shift();

            fotoPrincipal.src = "/uploads/" + foto;

            if (novo) {

                novo.style.display = "block";

                setTimeout(() => {

                    novo.style.display = "none";

                }, 3000);

            }

            return;

        }

        if (fotos.length === 0) return;

        indiceAtual++;

        if (indiceAtual >= fotos.length) {

            indiceAtual = 0;

        }

        fotoPrincipal.src = "/uploads/" + fotos[indiceAtual];

    }, 8000);

}

// Inicialização
carregarFotos();

// Procura novas fotos
setInterval(carregarFotos, 2000);