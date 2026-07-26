const fotos = document.getElementById("fotos");
const botaoEnviar = document.getElementById("enviar");
const mensagem = document.getElementById("mensagem");

botaoEnviar.addEventListener("click", () => {

    if (fotos.files.length === 0) {

        alert("Selecione pelo menos uma foto.");
        return;

    }

    // Aqui futuramente enviaremos as fotos
    // para o Google Drive.

    mensagem.style.display = "block";

    setTimeout(() => {

        mensagem.style.display = "none";

        fotos.value = "";

    }, 3000);

});