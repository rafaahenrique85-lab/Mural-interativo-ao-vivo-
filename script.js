const fotos = document.getElementById("fotos");
const fotoPrincipal = document.getElementById("fotoPrincipal");
const novo = document.getElementById("novo");

fotos.addEventListener("change", () => {

    if(fotos.files.length === 0) return;

    const leitor = new FileReader();

    leitor.onload = (e) => {

        fotoPrincipal.src = e.target.result;

        novo.style.display = "block";

        setTimeout(()=>{
            novo.style.display = "none";
        },3000);

    }

    leitor.readAsDataURL(fotos.files[0]);

});