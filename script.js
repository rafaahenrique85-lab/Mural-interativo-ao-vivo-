const fotos = document.getElementById("fotos");
const galeria = document.getElementById("galeria");

fotos.addEventListener("change", function(){

    galeria.innerHTML = "";

    for(let foto of fotos.files){

        const leitor = new FileReader();

        leitor.onload = function(e){

            const img = document.createElement("img");

            img.src = e.target.result;

            galeria.appendChild(img);

        }

        leitor.readAsDataURL(foto);

    }

});