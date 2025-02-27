const express = require('express');
const multer = require('multer');
const { r2 } = require('./config');
const Story = require('./models/Story');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Nenhum vídeo enviado' });

    const fileName = `stories/${Date.now()}-${req.file.originalname}`;

    await r2.upload({
      Bucket: process.env.R2_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    }).promise();

    const videoUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${fileName}`;

    const story = new Story({ productId, videoUrl });
    await story.save();

    res.json({ message: 'Story enviado com sucesso!', videoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no upload do story' });
  }
});

module.exports = router;

router.get('/stories/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const stories = await Story.find({ productId });

    if (stories.length === 0) {
      return res.status(404).json({ message: 'Nenhum story encontrado para este produto.' });
    }

    res.json({ stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar stories' });
  }
});
