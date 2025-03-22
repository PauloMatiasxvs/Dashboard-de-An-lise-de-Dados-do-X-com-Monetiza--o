const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/tweets/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const tweets = await twitterClient.v2.search(keyword, {
      'tweet.fields': 'created_at,public_metrics',
      max_results: 10,
    });
    res.json(tweets.data);
  } catch (error) {
    res.status(error.code || 500).json({ error: 'Erro ao buscar tweets', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});