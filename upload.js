const formulario = document.getElementById("formUpload");

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const arquivo = document.getElementById("foto").files[0];

    const dados = new FormData();
    dados.append("foto", arquivo);

    const resposta = await fetch("/upload", {
        method: "POST",
        body: dados
    });

    const texto = await resposta.text();
    alert(texto);
});