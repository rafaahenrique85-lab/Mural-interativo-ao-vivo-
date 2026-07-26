async function carregarFotos() {

    const resposta = await fetch("/fotos");
    const fotos = await resposta.json();

    const galeria = document.getElementById("galeria");
    galeria.innerHTML = "";

    fotos.forEach(foto => {

        const img = document.createElement("img");
        img.src = "/uploads/" + foto;

        galeria.appendChild(img);

    });

}

carregarFotos();

setInterval(carregarFotos, 3000);