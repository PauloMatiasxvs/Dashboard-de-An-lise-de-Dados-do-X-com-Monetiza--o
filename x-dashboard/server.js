const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Rota para buscar tweets por palavra-chave
app.get('/tweets/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const tweets = await twitterClient.v2.search(keyword, {
      'tweet.fields': 'created_at,public_metrics',
      max_results: 10,
    });
    res.json(tweets.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});