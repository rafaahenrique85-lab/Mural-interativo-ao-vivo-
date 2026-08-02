const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const fs = require("fs");
const caminhoEvento = path.join(__dirname, "evento.json");
const {
    enviarParaCloudinary,
    listarFotosCloudinary
} = require("./cloudinary");

const app = express();
const PORT = process.env.PORT || 3000;

// Evento atualmente ativo
let eventoAtual = {
    nome: "",
    modo: "automatico",
    tempo: 8
};

if (fs.existsSync(caminhoEvento)) {

    try {

        eventoAtual = JSON.parse(
            fs.readFileSync(caminhoEvento, "utf8")
        );

    } catch (erro) {

        console.error("Erro ao carregar evento:", erro);

    }

}

const fotosRecebidas = new Set();

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/pendentes", express.static(path.join(__dirname, "pendentes")));
app.use(express.json());

app.post("/evento", (req, res) => {

    eventoAtual = req.body;

    fs.writeFileSync(
        caminhoEvento,
        JSON.stringify(eventoAtual, null, 2)
    );

    console.log("Evento atualizado:", eventoAtual);

    res.json({
        sucesso: true
    });

});

app.get("/evento", (req, res) => {

    res.json(eventoAtual);

});

app.post("/encerrar-evento", async (req, res) => {

    try {

        // Apaga o arquivo do evento

        if (fs.existsSync(caminhoEvento)) {
            fs.unlinkSync(caminhoEvento);
        }

        // Limpa uploads
        const uploads = path.join(__dirname, "uploads");

        if (fs.existsSync(uploads)) {

            fs.readdirSync(uploads).forEach(arquivo => {
                fs.unlinkSync(path.join(uploads, arquivo));
            });

        }

        // Limpa pendentes
        const pendentes = path.join(__dirname, "pendentes");

        if (fs.existsSync(pendentes)) {

            fs.readdirSync(pendentes).forEach(arquivo => {
                fs.unlinkSync(path.join(pendentes, arquivo));
            });

        }

        // Reinicia o evento
        eventoAtual = {
            nome: "",
            modo: "automatico",
            tempo: 8
        };

        res.json({ sucesso: true });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({ sucesso: false });

    }

});

app.post("/upload", upload.single("foto"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).send("Nenhuma foto enviada.");
        }

        const hash = crypto
    .createHash("sha256")
    .update(req.file.buffer)
    .digest("hex");

if (fotosRecebidas.has(hash)) {
    console.log("❌ FOTO REPETIDA BLOQUEADA");
    return res.status(409).send("Esta foto já foi enviada anteriormente.");
}

console.log("✅ FOTO NOVA");

fotosRecebidas.add(hash);

        const nomeArquivo = Date.now() + ".jpg";

const pastaDestino =
    eventoAtual.modo === "manual" ? "pendentes" : "uploads";

const caminho = path.join(__dirname, pastaDestino, nomeArquivo);

await sharp(req.file.buffer)
    .rotate()
    .jpeg({ quality: 95 })
    .toFile(caminho);

// Responde imediatamente ao usuário
res.send("Foto enviada com sucesso!");

// Faz o backup em segundo plano
if (eventoAtual.modo === "automatico") {

    enviarParaCloudinary(caminho)
        .then(() => {
            console.log("☁️ Backup realizado no Cloudinary");
        })
        .catch((erro) => {
            console.error("Erro ao enviar para o Cloudinary:", erro);
        });

}

    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro ao processar a imagem.");
    }
});

app.get("/fotos", (req, res) => {

    const pasta = path.join(__dirname, "uploads");

    fs.readdir(pasta, (err, arquivos) => {

        if (err) {
            return res.json([]);
        }

        const fotos = arquivos
            .filter(arquivo => arquivo.endsWith(".jpg"))
            .sort()
            .map(arquivo => ({
                nome: arquivo,
                url: "/uploads/" + arquivo,
                data: arquivo.replace(".jpg", "")
            }));

        res.json(fotos);

    });

});

app.get("/pendentes", (req, res) => {

    const pasta = path.join(__dirname, "pendentes");

    fs.readdir(pasta, (err, arquivos) => {

        if (err) {
            return res.json([]);
        }

        arquivos.sort();

        res.json(arquivos);

    });

});

app.post("/aprovar", async (req, res) => {

    try {

        const { foto } = req.body;

        const origem = path.join(__dirname, "pendentes", foto);

        const destino = path.join(__dirname, "uploads", foto);
        

       await fs.promises.rename(origem, destino);

// Envia a foto aprovada para o Cloudinary
await enviarParaCloudinary(destino);

res.json({
    sucesso: true
});

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false
        });

    }

});

app.post("/rejeitar", (req, res) => {

    const { foto } = req.body;

    const arquivo = path.join(__dirname, "pendentes", foto);

    fs.unlink(arquivo, (err) => {

        if (err) {
            return res.status(500).json({
                sucesso: false
            });
        }

        res.json({
            sucesso: true
        });

    });

});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});