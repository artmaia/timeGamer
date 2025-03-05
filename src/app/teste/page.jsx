'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Gerenciamento = () => {
  // Dados fictícios para a tabela de gerenciamento
  const data = [
    { id: 1, atividade: 'Matemática', progresso: '75%' },
    { id: 2, atividade: 'História', progresso: '60%' },
    { id: 3, atividade: 'Biologia', progresso: '85%' },
  ];

  // Estado para controlar a visibilidade do sidebar
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 ${isSidebarVisible ? 'd-block' : 'd-none'} d-lg-block`}
        style={{ width: '250px' }}
      >
        <h2>Sidebar</h2>
        <ul className="list-unstyled">
          <li><a href="#" className="text-white">Home</a></li>
          <li><a href="#" className="text-white">Atividades</a></li>
          <li><a href="#" className="text-white">Metas</a></li>
          <li><a href="#" className="text-white">Gerenciamento</a></li>
          <li><a href="#" className="text-white">Recompensas</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-fill">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Logo</a>
          <button className="navbar-toggler" type="button" onClick={toggleSidebar} aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Link 1</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link 2</a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Gerenciamento Section */}
        <div className="container mt-4">
          <h1>Gerenciamento de Atividades</h1>
          <p>Veja o progresso das atividades abaixo:</p>

          {/* Tabela de Gerenciamento */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Atividade</th>
                <th>Progresso</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.atividade}</td>
                  <td>{item.progresso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Gerenciamento;
