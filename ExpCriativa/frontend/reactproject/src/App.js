import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [tela, setTela] = useState('listagem'); 
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', anoNascimento: '', endereco: '', genero: '', cpf: ''
  });

  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const urlApi = 'http://localhost:3001/usuarios';

  useEffect(() => {
    buscarUsuarios();
  }, []);

 
  const mostrarMensagem = (texto, tipo) => {
    setMensagem(texto);
    setTipoMensagem(tipo);

    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 3000);
  };

  const buscarUsuarios = async () => {
    try {
      const res = await fetch(urlApi);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      mostrarMensagem("Erro ao conectar com o servidor!", "erro");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const metodo = usuarioSelecionado ? 'PUT' : 'POST';
    const url = usuarioSelecionado ? `${urlApi}/${usuarioSelecionado.id}` : urlApi;

    try {
      await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      mostrarMensagem("Operação realizada com sucesso!", "sucesso");

      setFormData({ nome: '', anoNascimento: '', endereco: '', genero: '', cpf: '' });
      setUsuarioSelecionado(null);
      setTela('listagem');
      buscarUsuarios();

    } catch (error) {
      mostrarMensagem("Erro ao salvar usuário!", "erro");
    }
  };

  const excluirUsuario = async (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      try {
        await fetch(`${urlApi}/${id}`, { method: 'DELETE' });

        mostrarMensagem("Usuário excluído com sucesso!", "sucesso");
        buscarUsuarios();

      } catch {
        mostrarMensagem("Erro ao excluir usuário!", "erro");
      }
    }
  };

  const iniciarEdicao = (u) => {
    setUsuarioSelecionado(u);
    setFormData(u);
    setTela('cadastro');
  };

  const verDetalhes = (u) => {
    setUsuarioSelecionado(u);
    setTela('detalhes');
  };

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const usuariosPagina = usuarios.slice(indexPrimeiro, indexUltimo);

  return (
    <div className="container">

      <header className="header">
  <div className="header-content">
    <h1>Sistema de Usuários</h1>
    <span className="autor">André Vinícius Martins</span>
  </div>
</header>

      {mensagem && (
        <div className={`alert ${tipoMensagem === 'erro' ? 'alert-error' : 'alert-success'}`}>
          {mensagem}
        </div>
      )}

      <nav className="navbar">
        <button className="btn-nav" onClick={() => { setTela('listagem'); setUsuarioSelecionado(null); }}>
          Ver Lista
        </button>
        <button className="btn-nav" onClick={() => { 
          setTela('cadastro'); 
          setUsuarioSelecionado(null); 
          setFormData({nome:'', anoNascimento:'', endereco:'', genero:'', cpf:''}); 
        }}>
          Novo Cadastro
        </button>
      </nav>

      <div className="main-card">
        
        {tela === 'listagem' && (
          <section>
            <h2>Lista de Usuários</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ano</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPagina.map(u => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.anoNascimento}</td>
                    <td>
                      <button 
                        className="btn-nav" 
                        style={{padding: '5px 10px', fontSize: '12px'}} 
                        onClick={() => verDetalhes(u)}
                      >
                        Ver
                      </button>

                      <button 
                        className="btn-nav" 
                        style={{padding: '5px 10px', fontSize: '12px', borderColor: 'orange', color: 'orange'}} 
                        onClick={() => iniciarEdicao(u)}
                      >
                        Editar
                      </button>

                      <button 
                        className="btn-delete" 
                        onClick={() => excluirUsuario(u.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 1))}>
                Anterior
              </button>

              <span style={{ margin: '0 10px' }}>
                Página {paginaAtual}
              </span>

              <button onClick={() => setPaginaAtual(p => p + 1)}>
                Próxima
              </button>
            </div>

          </section>
        )}

        {tela === 'cadastro' && (
          <section>
            <h2>{usuarioSelecionado ? "Editar Usuário" : "Novo Cadastro"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Nome" 
                  value={formData.nome} 
                  onChange={e => setFormData({...formData, nome: e.target.value})} 
                  required 
                />

                <input 
                  type="number" 
                  placeholder="Ano Nascimento" 
                  value={formData.anoNascimento} 
                  onChange={e => setFormData({...formData, anoNascimento: e.target.value})} 
                />

                <input 
                  type="text" 
                  placeholder="Endereço" 
                  value={formData.endereco} 
                  onChange={e => setFormData({...formData, endereco: e.target.value})} 
                />

                <input 
                  type="text" 
                  placeholder="Gênero" 
                  value={formData.genero} 
                  onChange={e => setFormData({...formData, genero: e.target.value})} 
                />

                <input 
                  type="text" 
                  placeholder="CPF" 
                  value={formData.cpf} 
                  onChange={e => setFormData({...formData, cpf: e.target.value})} 
                  required 
                />
              </div>

              <button type="submit" className="btn-save">
                {usuarioSelecionado ? "Salvar Alterações" : "Cadastrar Usuário"}
              </button>
            </form>
          </section>
        )}

        {tela === 'detalhes' && usuarioSelecionado && (
          <section style={{textAlign: 'left'}}>
            <h2>Detalhes do Usuário</h2>

            <div style={{padding: '10px', lineHeight: '2'}}>
              <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
              <p><strong>CPF:</strong> {usuarioSelecionado.cpf}</p>
              <p><strong>Ano:</strong> {usuarioSelecionado.anoNascimento}</p>
              <p><strong>Gênero:</strong> {usuarioSelecionado.genero}</p>
              <p><strong>Endereço:</strong> {usuarioSelecionado.endereco}</p>
            </div>

            <button 
              className="btn-save" 
              onClick={() => setTela('listagem')}
            >
              Voltar para Lista
            </button>
          </section>
        )}

      </div>

      <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
        
      </p>
    </div>
  );
}

export default App;