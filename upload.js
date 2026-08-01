const formulario = document.getElementById("formUpload");
const foto = document.getElementById("foto");

const progresso = document.querySelector(".progresso");
const barra = document.getElementById("barraProgresso");
const percentual = document.getElementById("percentual");
const mensagem = document.getElementById("mensagem");

// Ao selecionar a foto envia automaticamente
foto.addEventListener("change", () => {

    if (foto.files.length === 0) return;

    formulario.requestSubmit();

});

formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    const arquivo = foto.files[0];

    if (!arquivo) return;

    const dados = new FormData();
    dados.append("foto", arquivo);

    progresso.style.display = "block";
    barra.value = 0;
    percentual.textContent = "0%";

    mensagem.style.display = "none";
    mensagem.innerHTML = "";
    mensagem.style.color = "#5cff87";

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {

        if (!e.lengthComputable) return;

        const porcentagem = Math.round((e.loaded / e.total) * 100);

        barra.value = porcentagem;
        percentual.textContent = porcentagem + "%";

    };

    xhr.onload = () => {

        if (xhr.status === 200) {

            barra.value = 100;
            percentual.textContent = "100%";

            mensagem.style.display = "block";
            mensagem.style.color = "#5cff87";

            mensagem.innerHTML = `
                <strong>Foto enviada com sucesso!</strong><br>
                Ela aparecerá no mural em instantes.
            `;

        } else {

            progresso.style.display = "none";

            mensagem.style.display = "block";
            mensagem.style.color = "#ff5b5b";

            mensagem.innerHTML = `
                <strong>${xhr.responseText}</strong>
            `;

        }

        formulario.reset();

        setTimeout(() => {

            progresso.style.display = "none";

            barra.value = 0;
            percentual.textContent = "0%";

            mensagem.style.display = "none";
            mensagem.innerHTML = "";
            mensagem.style.color = "#5cff87";

        }, 3500);

    };

    xhr.onerror = () => {

        progresso.style.display = "none";

        mensagem.style.display = "block";
        mensagem.style.color = "#ff5b5b";

        mensagem.innerHTML = `
            <strong>Erro de conexão com o servidor.</strong>
        `;

    };

    xhr.open("POST", "/upload");
    xhr.send(dados);

});