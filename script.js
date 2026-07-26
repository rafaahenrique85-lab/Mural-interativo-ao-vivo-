const fotoPrincipal = document.getElementById("fotoPrincipal");
const miniaturasEsquerda = document.getElementById("miniaturasEsquerda");
const miniaturasDireita = document.getElementById("miniaturasDireita");
const novo = document.getElementById("novo");

let ultimaFoto = "";

async function carregarFotos() {

    try {

        const resposta = await fetch("/fotos");
        const fotos = await resposta.json();

        if (!fotos.length) return;

        fotos.sort();

        const fotoAtual = "/uploads/" + fotos[fotos.length - 1];

        if (fotoAtual !== ultimaFoto) {

            ultimaFoto = fotoAtual;

            fotoPrincipal.style.opacity = "0";

            setTimeout(() => {

                fotoPrincipal.src = fotoAtual;
                fotoPrincipal.style.opacity = "1";

                novo.style.display = "block";

                setTimeout(() => {

                    novo.style.display = "none";

                }, 3000);

            }, 300);

        }

        miniaturasEsquerda.innerHTML = "";
        miniaturasDireita.innerHTML = "";

        const lista = [...fotos].reverse();

        lista.forEach((foto, indice) => {

            const img = document.createElement("img");

            img.src = "/uploads/" + foto;

            img.onclick = () => {

                fotoPrincipal.src = img.src;

            };

            if (indice % 2 === 0) {

                miniaturasEsquerda.appendChild(img);

            } else {

                miniaturasDireita.appendChild(img);

            }

        });

    } catch (erro) {

        console.log(erro);

    }

}

carregarFotos();

setInterval(carregarFotos, 2000);