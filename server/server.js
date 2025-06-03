const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static('C:/Users/lilia/Documents/ProjetoSCCP/public'));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Corinthians1910',
  database: 'corinthians_site'
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado ao MySQL");
});

// Cadastro de usuário
app.post('/usuarios', (req, res) => {
  const { nome, cpf, email, senha } = req.body;

  db.query('INSERT INTO usuarios (nome, cpf, email, senha) VALUES (?, ?, ?, ?)',
    [nome, cpf, email, senha],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao cadastrar usuário');
      }
      res.status(201).send('Usuário cadastrado com sucesso');
    });
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length > 0) {
        res.send({ nome: results[0].nome });
      } else {
        res.status(401).send('E-mail ou senha incorretos');
      }
    });
});

// Estatísticas por data de cadastro
app.get('/estatisticas', (req, res) => {
  const sql = `
    SELECT DATE(criado_em) AS data, COUNT(*) AS total
    FROM usuarios
    GROUP BY DATE(criado_em)
    ORDER BY DATE(criado_em)
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Total de usuários
app.get('/total-usuarios', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Salvar resultados do quiz
app.post('/salvar-resultado', (req, res) => {
  const { email, acertos, total, respostas } = req.body;

  db.query('SELECT id FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(500).send('Usuário não encontrado');
    const usuario_id = results[0].id;

    db.query(
      'INSERT INTO resultados_quiz (usuario_id, acertos, total, respostas) VALUES (?, ?, ?, ?)',
      [usuario_id, acertos, total, JSON.stringify(respostas)],
      (err, result) => {
        if (err) return res.status(500).send('Erro ao inserir resultado');

        const resultado_id = result.insertId;

        const values = respostas.map((correta, i) => [resultado_id, i + 1, correta ? 'certa' : 'errada', correta]);

        db.query(
          'INSERT INTO respostas (resultado_id, pergunta_id, resposta_usuario, correta) VALUES ?',
          [values],
          (err) => {
            if (err) return res.status(500).send('Erro ao salvar respostas individuais');
            res.sendStatus(200);
          }
        );
      }
    );
  });
});

// Média de acertos por pergunta
app.get('/media-pergunta', (req, res) => {
  db.query('SELECT respostas FROM resultados_quiz WHERE respostas IS NOT NULL', (err, results) => {
    if (err) {
      console.error('Erro ao buscar respostas:', err);
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }

    const totais = Array(10).fill(0);
    const corretas = Array(10).fill(0);

    results.forEach(row => {
      try {
        const respostas = typeof row.respostas === 'string'
          ? JSON.parse(row.respostas)
          : row.respostas;

        if (Array.isArray(respostas)) {
          respostas.forEach((r, i) => {
            totais[i]++;
            if (r) corretas[i]++;
          });
        }
      } catch (e) {
        console.error('Erro ao analisar resposta:', row.respostas);
      }
    });

    const medias = corretas.map((c, i) => totais[i] ? c / totais[i] : 0);
    res.json({ medias });
  });
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
