const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Corinthians1910', // ou sua senha real
  database: 'corinthians_site'
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado ao MySQL");
});

// Cria tabela se não existir
db.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cpf VARCHAR(14),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Cadastro simples
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

app.get('/total-usuarios', (req, res) => {
  db.query('SELECT COUNT(*) AS total FROM usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

app.post('/salvar-resultado', (req, res) => {
  const { email, acertos, total } = req.body;

  const sql = 'INSERT INTO resultados_quiz (email, acertos, total) VALUES (?, ?, ?)';
  db.query(sql, [email, acertos, total], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Resultado salvo com sucesso');
  });
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
app.get('/media-quiz', (req, res) => {
  const sql = `
    SELECT email, ROUND(AVG(acertos), 2) AS media_acertos
    FROM resultados_quiz
    GROUP BY email
    ORDER BY media_acertos DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

