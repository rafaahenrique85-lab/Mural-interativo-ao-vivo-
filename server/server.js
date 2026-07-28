const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Evento atualmente ativo
let eventoAtual = {
    nome: "",
    modo: "automatico",
    tempo: 8
};

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.post("/evento", (req, res) => {

    eventoAtual = req.body;

    console.log("Evento atualizado:", eventoAtual);

    res.json({
        sucesso: true
    });

});

app.get("/evento", (req, res) => {

    res.json(eventoAtual);

});

app.post("/upload", upload.single("foto"), async (req, res) => {
    try {

        console.log("Modo do evento:", eventoAtual.modo);

if (eventoAtual.modo === "manual") {
    console.log("Foto será enviada para a fila de aprovação.");
} else {
    console.log("Foto será enviada diretamente para o mural.");
}
        if (!req.file) {
            return res.status(400).send("Nenhuma foto enviada.");
        }

        const nomeArquivo = Date.now() + ".jpg";

const pastaDestino =
    eventoAtual.modo === "manual" ? "pendentes" : "uploads";

const caminho = path.join(__dirname, pastaDestino, nomeArquivo);

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
app.post("/aprovar", (req, res) => {

    const { foto } = req.body;

    const origem = path.join(__dirname, "pendentes", foto);

    const destino = path.join(__dirname, "uploads", foto);

    fs.rename(origem, destino, (err) => {

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

app.listen(PORT, () => {
    console.log("Servidor rodando em http://localhost:3000");
});