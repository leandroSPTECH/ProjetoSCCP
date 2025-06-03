

window.addEventListener('DOMContentLoaded', () => {
  const nome = localStorage.getItem('nomeLogin');
  const email = localStorage.getItem('emailLogin');
  
  if (nome || email) {
    const div = document.createElement('div');
    div.innerText = `🔐 Usuário logado: ${nome || email}`;
    div.style.padding = '10px';
    div.style.backgroundColor = '#222';
    div.style.color = 'white';
    div.style.textAlign = 'center';
    div.style.fontSize = '18px';
    
    // Botão de sair
    const btnSair = document.createElement('button');
    btnSair.innerText = 'Sair';
    btnSair.style.marginLeft = '20px';
    btnSair.onclick = () => {
      localStorage.removeItem('nomeLogin');
      localStorage.removeItem('emailLogin');
      location.reload();
    };
    div.appendChild(btnSair);

    document.body.prepend(div);
  }
});

// Rolagem suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Animações de entrada com Intersection Observer
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
function ativarAba(id) {
    document.querySelectorAll('.tab-content').forEach(sec => {
        sec.style.display = 'none';
    });
    const ativa = document.getElementById(id);
    if (ativa) {
        ativa.style.display = 'block';
        ativa.scrollIntoView({ behavior: 'smooth' });
    }
}
// login
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value;
  const senha = document.getElementById('senhaLogin').value;

  console.log('Tentando logar com:', email, senha); // 👈 Adicione isso

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(res => {
    if (!res.ok) throw new Error('Login falhou');
    return res.json();
  })
  .then(data => {
    alert(`Bem-vindo, ${data.nome}`);
    localStorage.setItem('emailLogin', email);
    localStorage.setItem('nomeLogin', data.nome);
    window.location.href = 'index.html';
  })
  .catch(err => {
    console.error('Erro no login:', erro);
    alert('E-mail ou senha incorretos.');
  });
});

// Cadastro
document.getElementById('cadastroForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nomeCadastro').value;
  const cpf = document.getElementById('cpfCadastro').value;
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  if (!/^\d{11}$/.test(cpf)) {
    alert('CPF inválido. Digite apenas 11 números.');
    return;
  }

  // NOVO: Enviar para a API
  fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, cpf, email, senha })
  })
  .then(res => {
    if (res.ok) {
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    } else {
      alert('Erro ao cadastrar usuário.');
    }
  })
  .catch(() => alert('Erro na conexão com o servidor.'));
});

const perguntas = [
  {
    pergunta: "Em que ano o Corinthians foi fundado?",
    opcoes: ["1910", "1909", "1912", "1914"],
    resposta: "1910"
  },
  {
    pergunta: "Qual estádio é conhecido como casa do Corinthians?",
    opcoes: ["Morumbi", "Neo Química Arena", "Pacaembu", "Maracanã"],
    resposta: "Neo Química Arena"
  },
  {
    pergunta: "Quem foi o líder da Democracia Corinthiana?",
    opcoes: ["Basílio", "Sócrates", "Casagrande", "Marcelinho Carioca"],
    resposta: "Sócrates"
  },
  {
    pergunta: "Quantos Mundiais da FIFA o Corinthians tem?",
    opcoes: ["1", "2", "3", "Nenhum"],
    resposta: "2"
  },
  {
    pergunta: "Contra qual time o Corinthians venceu o Mundial de 2012?",
    opcoes: ["Barcelona", "Chelsea", "Boca Juniors", "Manchester United"],
    resposta: "Chelsea"
  },
  {
    pergunta: "Qual o apelido da torcida do Corinthians?",
    opcoes: ["Galera", "Fiel", "Torcida Jovem", "Mancha"],
    resposta: "Fiel"
  },
  {
    pergunta: "Em que ano o Corinthians venceu a Libertadores?",
    opcoes: ["2011", "2012", "2013", "2010"],
    resposta: "2012"
  },
  {
    pergunta: "Qual jogador fez o gol do título de 1977?",
    opcoes: ["Marcelinho", "Basílio", "Sócrates", "Edílson"],
    resposta: "Basílio"
  },
  {
    pergunta: "Qual cor é predominante no uniforme do Corinthians?",
    opcoes: ["Verde", "Azul", "Preto e Branco", "Amarelo"],
    resposta: "Preto e Branco"
  },
  {
    pergunta: "Qual título o clube conquistou invicto em 2012?",
    opcoes: ["Paulistão", "Copa do Brasil", "Libertadores", "Brasileirão"],
    resposta: "Libertadores"
  }
];

let indice = 0;
let acertos = 0;
let respostasUsuario = [];

function carregarPergunta() {
  const p = perguntas[indice];
  document.getElementById('pergunta').innerText = `${indice + 1}. ${p.pergunta}`;
  const opcoesDiv = document.getElementById('opcoes');
  opcoesDiv.innerHTML = '';

  p.opcoes.forEach(op => {
    const btn = document.createElement('button');
    btn.innerText = op;
    btn.classList.add('btn-cta');
    btn.style.margin = '10px';
    btn.onclick = () => verificarResposta(op);
    opcoesDiv.appendChild(btn);
  });
}

function verificarResposta(escolha) {
  const correta = perguntas[indice].resposta;
  if (escolha === correta) {
  acertos++;
  respostasUsuario.push(true);
} else {
  respostasUsuario.push(false);
}
  document.querySelectorAll('#opcoes button').forEach(btn => btn.disabled = true);
  document.getElementById('proxima').style.display = 'inline-block';
}

document.getElementById('proxima')?.addEventListener('click', () => {
  indice++;
  if (indice < perguntas.length) {
    document.getElementById('proxima').style.display = 'none';
    carregarPergunta();
  } else {
    // Salva o resultado do quiz no banco
const emailSalvo = localStorage.getItem('emailLogin') || 'anônimo';
fetch('http://localhost:3000/salvar-resultado', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: emailSalvo,
    acertos: acertos,
    total: perguntas.length,
    respostas: respostasUsuario
  })
})
.then(res => {
  if (res.ok) {
    alert(`Você acertou ${acertos} de ${perguntas.length} perguntas.`);
    window.location.href = 'dashboard.html';
  } else {
    alert('Erro ao salvar resultado.');
  }
})
.catch(() => alert('Erro ao conectar com o servidor.'));
  }
});

// Apenas se estiver na página da dashboard
if (document.getElementById('graficoMediaPorPergunta')) {

  // Total de usuários
  fetch('http://localhost:3000/total-usuarios')
    .then(res => res.json())
    .then(data => {
      document.getElementById('totalUsuarios').innerText = data.total;
    });

  // Gráfico de cadastros por dia
  fetch('http://localhost:3000/estatisticas')
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.data);
      const valores = data.map(item => item.total);

      new Chart(document.getElementById('cadastrosChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Cadastros por dia',
            data: valores,
            borderColor: 'blue',
            backgroundColor: 'lightblue',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    });

  // Gráfico: Média de acertos por pergunta
fetch('http://localhost:3000/media-pergunta')
  .then(res => res.json())
  .then(dados => {
    const medias = dados.medias;
    console.log("Médias:", medias);
    const ctx = document.getElementById('graficoMediaPorPergunta').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: medias.map((_, i) => `Pergunta ${i + 1}`),
        datasets: [{
          label: 'Média de acertos (%)',
          data: medias.map(m => m * 100), // Converter para porcentagem
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#fff', callback: value => value + '%' }
          },
          x: {
            ticks: { color: '#fff' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } }
        }
      }
    });
  })
  .catch(err => {
    console.error('Erro ao buscar média por pergunta:', err);
  });
}


// Inicia o quiz carregando a primeira pergunta ao abrir a página
if (document.body.classList.contains('pagina-quiz')) {
  carregarPergunta();
}


