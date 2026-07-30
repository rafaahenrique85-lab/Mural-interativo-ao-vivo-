const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function enviarParaCloudinary(caminhoArquivo) {

    const resultado = await cloudinary.uploader.upload(caminhoArquivo, {
        folder: "PixWall"
    });

    console.log("Foto enviada:", resultado.secure_url);

    return resultado;

}

module.exports = {
    enviarParaCloudinary
};