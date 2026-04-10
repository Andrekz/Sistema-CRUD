const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();

app.use(cors());
app.use(express.json());


app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/usuarios/:id', async (req, res) => {8
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/usuarios', async (req, res) => {
    
    const { nome, anoNascimento, endereco, genero, cpf } = req.body;
    
    try {
        const query = 'INSERT INTO usuarios (nome, anoNascimento, endereco, genero, cpf) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [nome, anoNascimento, endereco, genero, cpf]);
        res.status(201).json({ message: "Cadastrado com sucesso!" });
    } catch (err) {
        console.error("ERRO:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, anoNascimento, endereco, genero, cpf } = req.body;
    try {
        
        const query = 'UPDATE usuarios SET nome=?, anoNascimento=?, endereco=?, genero=?, cpf=? WHERE id=?';
        await db.query(query, [nome, anoNascimento, endereco, genero, cpf, id]);
        res.json({ message: "Atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ message: "Excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => {
    console.log("Servidor backend a rodar na porta 3001");
});