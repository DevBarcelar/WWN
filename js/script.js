const API_KEY = 'pub_3cb07ed289994b4b9f994c3163ff0a23';
const newsList = document.getElementById('newsList');

async function carregarNoticias(termo = '', categoria = '') {
    newsList.innerHTML = '<p class="loading">Buscando notícias...</p>';
    
    const catFiltro = (categoria === 'general' || categoria === '') ? 'top' : categoria;
    
    let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=pt&country=br`;

    if (termo !== '') {
        url += `&q=${encodeURIComponent(termo)}`;
    } else {
        url += `&category=${catFiltro}`;
    }

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.status === "error") {
            throw new Error(dados.results.message || "Erro desconhecido na API");
        }

        if (dados.results && dados.results.length > 0) {
            renderizarNoticias(dados.results);
        } else {
            newsList.innerHTML = '<p>Nenhuma notícia encontrada para esta busca.</p>';
        }

    } catch (erro) {
        console.error('Erro na requisição:', erro);
        newsList.innerHTML = `<p>Erro: ${erro.message}. Verifique se excedeu o limite diário da API.</p>`;
    }
}

function renderizarNoticias(artigos) {
    newsList.innerHTML = ''; 
    
    artigos.forEach(artigo => {
        const item = document.createElement('article');
        item.className = 'news-item';
        
        const imgUrl = artigo.image_url || 'https://images.unsplash.com/photo-1504711432869-5d5932e23d01?w=800';
        
        item.innerHTML = `
            <div class="news-image-container">
                <img src="${imgUrl}" alt="Notícia" onerror="this.src='https://images.unsplash.com/photo-1504711432869-5d5932e23d01?w=800'">
            </div>
            <h2>${artigo.title}</h2>
            <p>${artigo.description || 'Clique no botão abaixo para ler os detalhes desta notícia no portal original.'}</p>
            <a href="${artigo.link}" target="_blank" class="leia-mais-btn">Ler Notícia</a>
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
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeBtn.textContent = document.body.classList.contains('dark-theme') 
            ? '☀️ Modo Claro' 
            : '🌙 Modo Escuro';
    });
}

const newsForm = document.getElementById('newsletterForm');
if (newsForm) {
    newsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('formMessage').textContent = "Inscrição realizada com sucesso!";
        this.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarNoticias();
});