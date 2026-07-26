const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("foto"), (req, res) => {
    res.send("Foto enviada com sucesso!");
});

app.get("/fotos", (req, res) => {
    const pasta = path.join(__dirname, "uploads");

    fs.readdir(pasta, (err, arquivos) => {
        if (err) return res.json([]);
        res.json(arquivos);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});