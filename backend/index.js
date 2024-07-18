const express = require('express');
const cors = require('cors');
const { LanguageServiceClient } = require('@google-cloud/language');
const app = express();
require('dotenv').config();

const client = new LanguageServiceClient();

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  try {
    const [result] = await client.analyzeEntities({ document: { content: text, type: 'PLAIN_TEXT' } });
    const entities = result.entities.map(entity => entity.name);

    res.json({ summary: 'Summary goes here', insights: entities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});