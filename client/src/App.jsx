import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AlunoPage from './pages/AlunoPage';
import ProfessorPage from './pages/ProfessorPage';
import ProfessorAdmPage from './pages/ProfessorAdmPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/aluno" element={<AlunoPage />} />
        <Route path="/professor" element={<ProfessorPage />} />
        <Route path="/professor-adm" element={<ProfessorAdmPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
