const formulario = document.getElementById("formUpload");
const progresso = document.querySelector(".progresso");
const barra = document.getElementById("barraProgresso");
const percentual = document.getElementById("percentual");
const mensagem = document.getElementById("mensagem");

const foto = document.getElementById("foto");
const botao = document.getElementById("btnSelecionar");

botao.addEventListener("click", () => {
    foto.click();
});

foto.addEventListener("change", () => {
    if (foto.files.length > 0) {
        formulario.requestSubmit();
    }
});

formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    const arquivo = foto.files[0];

    if (!arquivo) {
        alert("Selecione uma foto.");
        return;
    }

    const dados = new FormData();
    dados.append("foto", arquivo);

    progresso.style.display = "block";
    barra.value = 0;
    percentual.textContent = "0%";

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {

        if (e.lengthComputable) {

            const porcentagem = Math.round((e.loaded / e.total) * 100);

            barra.value = porcentagem;
            percentual.textContent = porcentagem + "%";

        }

    });

    xhr.onload = () => {

    barra.value = 100;
    percentual.textContent = "100%";

    mensagem.style.display = "block";
    mensagem.textContent = xhr.responseText;

    formulario.reset();

    setTimeout(() => {

        progresso.style.display = "none";
        barra.value = 0;
        percentual.textContent = "0%";

        mensagem.style.display = "none";
        mensagem.textContent = "";

    }, 2500);

};

    xhr.open("POST", "/upload");
    xhr.send(dados);

});