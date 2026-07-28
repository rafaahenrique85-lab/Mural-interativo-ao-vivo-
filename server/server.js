const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("foto"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Nenhuma foto enviada.");
        }

        const nomeArquivo = Date.now() + ".jpg";
        const caminho = path.join(__dirname, "uploads", nomeArquivo);

        await sharp(req.file.buffer)
            .rotate()
            .jpeg({ quality: 95 })
            .toFile(caminho);

        res.send("Foto enviada com sucesso!");
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

        arquivos.sort();
        res.json(arquivos);
    });
});

app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:3000");
});