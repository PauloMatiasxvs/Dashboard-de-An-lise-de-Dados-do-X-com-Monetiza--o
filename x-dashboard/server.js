const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const path = require('path'); // Adicionado para lidar com caminhos
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

// Configura a pasta "public" como diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
    console.error('Erro na busca de tweets:', error);
    res.status(500).json({ error: 'Erro ao buscar tweets', details: error.message });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});