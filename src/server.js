require('dotenv').config();
console.log("Bucket Name:", process.env.CLOUDFLARE_BUCKET_NAME); // Teste

const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const port = 3001;

// Configurar Multer para armazenar localmente antes de enviar ao R2
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configurar cliente S3 para Cloudflare R2
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY,
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log("Recebendo upload...");

        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
        }

        const file = req.file;
        console.log("Arquivo recebido:", file.originalname);

        const params = {
            Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        };

        console.log("Enviando para Cloudflare R2...");
        const response = await s3.send(new PutObjectCommand(params));
        console.log("Cloudflare Response:", response);

        const fileUrl = `${process.env.CLOUDFLARE_ENDPOINT}/${file.originalname}`;
        res.json({ message: "Upload bem-sucedido!", url: fileUrl });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).json({ error: "Erro ao enviar para o Cloudflare R2" });
    }

    const videoUrl = `${process.env.CLOUDFLARE_ENDPOINT}/${fileName}`;
    console.log("Video disponível em:", videoUrl);
    
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


