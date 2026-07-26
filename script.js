const fotoPrincipal = document.getElementById("fotoPrincipal");
const novo = document.getElementById("novo");

let filaFotos = [];
let exibindo = false;

function adicionarFoto(src) {

    filaFotos.push(src);

    if (!exibindo) {
        mostrarProximaFoto();
    }

}

function mostrarProximaFoto() {

    if (filaFotos.length === 0) {

        exibindo = false;
        return;

    }

    exibindo = true;

    const foto = filaFotos.shift();

    fotoPrincipal.style.opacity = "0";

    setTimeout(() => {

        fotoPrincipal.src = foto;

        fotoPrincipal.style.opacity = "1";

        novo.style.display = "block";

        setTimeout(() => {

            novo.style.display = "none";

        }, 3000);

    }, 300);

    setTimeout(() => {

        mostrarProximaFoto();

    }, 8000);

}

/*
==================================================

FUNÇÃO TEMPORÁRIA PARA TESTES

Enquanto ainda não conectamos ao Google Drive,
você pode abrir o Console (F12) e executar:

adicionarFoto("caminho_da_imagem.jpg");

Depois essa função será utilizada automaticamente
pelas fotos enviadas pelos convidados.

==================================================
*/

window.adicionarFoto = adicionarFoto;