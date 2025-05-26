import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import PatientsPage from "./pages/PatientsPage";
import RecordsPage from "./pages/RecordsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ContractsPage from "./pages/ContractsPage";

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
      </Routes>
    </Router>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif; 
    background-color: #f8fafe;
  }
`;

const MainPage = () => {
  return (
    <Container>
      <Title>Главная страница</Title>
      <LinkStyled to="/patients">Список пациентов</LinkStyled>
      <LinkStyled to="/records">Список записей</LinkStyled>
      <LinkStyled to="/payments">Список оплат</LinkStyled>
      <LinkStyled to="/reports">Список отчетов</LinkStyled>
      <LinkStyled to="/contracts">Список договоров</LinkStyled>
      <LinkStyled to="/login">Выйти из системы</LinkStyled>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const LinkStyled = styled(Link)`
  display: block;
  margin: 10px 0;
  text-decoration: none;
  color: #4a90e2;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #eaeaea;
  }
`;

export default App;
