const API_KEY = '2d0b1a17a3cd081a2f9de705c922d78a';
const newsList = document.getElementById('newsList');

async function carregarNoticias(termo = '', categoria = 'general') {
    newsList.innerHTML = '<p class="loading">Buscando notícias...</p>';
    
    let url = '';

    if (termo !== '') {
        const apiUrl = `https://gnews.io/api/v4/search?q=${termo}&lang=pt&country=br&max=10&apikey=${API_KEY}`;
        url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
    } else {
        const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${categoria}&lang=pt&country=br&max=10&apikey=${API_KEY}`;
        url = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
    }

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        if (dados.articles && dados.articles.length > 0) {
            renderizarNoticias(dados.articles);
        } else {
            newsList.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        }

    } catch (erro) {
        console.error('Erro na API:', erro);
        newsList.innerHTML = '<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>';
    }
}

function renderizarNoticias(artigos) {
    newsList.innerHTML = ''; 
    
    artigos.forEach(artigo => {
        const item = document.createElement('article');
        item.className = 'news-item';
        
        const imgUrl = artigo.image || 'https://images.unsplash.com/photo-1504711432869-5d5932e23d01?w=800';
        
        item.innerHTML = `
            <img src="${imgUrl}" alt="Notícia">
            <h2>${artigo.title}</h2>
            <p>${artigo.description || 'Leia a notícia completa.'}</p>
            <a href="${artigo.url}" target="_blank" class="leia-mais-btn">Ler Notícia</a>
        `;
        
        newsList.appendChild(item);
    });
}

document.querySelectorAll('#nav-filtros a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const cat = this.getAttribute('data-categoria');
        document.getElementById('searchInput').value = '';
        carregarNoticias('', cat);
    });
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const busca = document.getElementById('searchInput').value.trim();
    if (busca !== '') {
        carregarNoticias(busca); 
    }
});

const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeBtn.textContent = document.body.classList.contains('dark-theme') 
        ? '☀️ Modo Claro' 
        : '🌙 Modo Escuro';
});

document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('formMessage').textContent = "Inscrição realizada com sucesso!";
    this.reset();
});

document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias('', 'general');
});