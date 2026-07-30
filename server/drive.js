const { google } = require("googleapis");

console.log("Drive.js carregado.");

const auth = new google.auth.GoogleAuth({
    keyFile: "./server/pixwall-503612-4e34ef7f5d72.json",
    scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({
    version: "v3",
    auth
});

async function enviarParaDrive(caminhoArquivo) {

const resposta = await drive.files.create({
  requestBody: {
    name: require("path").basename(caminhoArquivo),
    parents: ["1-RUnkiR7vrLHdpQ10EgG2KSp_RIvym1B"]
  },

  media: {
    mimeType: "image/jpeg",
    body: require("fs").createReadStream(caminhoArquivo)
  }
});

console.log("Arquivo enviado para o Drive!");

console.log(resposta.data.id);

}

module.exports = {
    drive,
    enviarParaDrive
};