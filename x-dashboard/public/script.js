document.addEventListener('DOMContentLoaded', () => {
    const tweetsSection = document.getElementById('tweets');
    const loader = document.getElementById('loader');
    const tweetCount = document.getElementById('tweet-count');
    const totalLikes = document.getElementById('total-likes');
    const totalRetweets = document.getElementById('total-retweets');
    let tweetData = [];
  
    // Função principal para buscar tweets
    window.fetchTweets = async () => {
      const keyword = document.getElementById('keyword').value.trim();
      if (!keyword) {
        alert('Por favor, insira uma palavra-chave!');
        return;
      }
  
      tweetsSection.innerHTML = '';
      loader.style.display = 'block';
      tweetData = [];
  
      try {
        const response = await fetch(`http://localhost:3000/tweets/${encodeURIComponent(keyword)}`);
        if (!response.ok) throw new Error('Erro na requisição');
        const data = await response.json();
  
        if (!data.data || data.data.length === 0) {
          tweetsSection.innerHTML = '<p>Nenhum tweet encontrado.</p>';
          updateStats(0, 0, 0);
          return;
        }
  
        tweetData = data.data;
        renderTweets(tweetData);
        updateStats(tweetData.length, calculateTotalLikes(tweetData), calculateTotalRetweets(tweetData));
      } catch (error) {
        tweetsSection.innerHTML = `<p>Erro ao carregar tweets: ${error.message}</p>`;
        console.error('Erro:', error);
      } finally {
        loader.style.display = 'none';
      }
    };
  
    // Renderizar tweets na tela
    function renderTweets(tweets) {
      tweetsSection.innerHTML = '';
      tweets.forEach(tweet => {
        const card = document.createElement('div');
        card.className = 'tweet-card';
        card.innerHTML = `
          <p class="tweet-text">${formatTweetText(tweet.text)}</p>
          <div class="tweet-metrics">
            <span>❤️ ${tweet.public_metrics.like_count}</span>
            <span>🔄 ${tweet.public_metrics.retweet_count}</span>
            <span>📅 ${new Date(tweet.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        `;
        tweetsSection.appendChild(card);
      });
    }
  
    // Formatar texto do tweet (links clicáveis)
    function formatTweetText(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
    }
  
    // Calcular estatísticas
    function calculateTotalLikes(tweets) {
      return tweets.reduce((sum, tweet) => sum + tweet.public_metrics.like_count, 0);
    }
  
    function calculateTotalRetweets(tweets) {
      return tweets.reduce((sum, tweet) => sum + tweet.public_metrics.retweet_count, 0);
    }
  
    // Atualizar painel de estatísticas
    function updateStats(count, likes, retweets) {
      tweetCount.textContent = count;
      totalLikes.textContent = likes;
      totalRetweets.textContent = retweets;
    }
  
    // Ordenar tweets
    window.sortTweets = () => {
      const sortValue = document.getElementById('sort').value;
      let sortedTweets = [...tweetData];
  
      if (sortValue === 'likes') {
        sortedTweets.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count);
      } else if (sortValue === 'retweets') {
        sortedTweets.sort((a, b) => b.public_metrics.retweet_count - a.public_metrics.retweet_count);
      } else {
        sortedTweets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
  
      renderTweets(sortedTweets);
    };
  
    // Adicionar evento de tecla Enter no input
    document.getElementById('keyword').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') fetchTweets();
    });
  });