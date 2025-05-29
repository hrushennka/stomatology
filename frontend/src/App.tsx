import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Colors } from "./constants/Colors";
import ProvidedServicePage from "./pages/ProvidedServicePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ContractsPage from "./pages/ContractsPage";

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/services" element={<ProvidedServicePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
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
    background-color:rgba(247, 248, 252, 0.49);
  }
`;

const MainPage = () => {
  return (
    <Container>
      <Title>Главная страница</Title>
      <ListWindow>
        <ListStyled>
          <LinkStyled to="/services">Список оказанных услуг</LinkStyled>
          <LinkStyled to="/appointments">Список записей</LinkStyled>
          <LinkStyled to="/payments">Список оплат</LinkStyled>
          <LinkStyled to="/contracts">Список договоров</LinkStyled>
        </ListStyled>
        <LinkExitStyled to="/login">Выйти из системы</LinkExitStyled>
      </ListWindow>
    </Container>
  );
};

const ListWindow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid rgb(189, 189, 189) 1px;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${Colors.main};
  padding-bottom: 30px;
`;
const ListStyled = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.main};
  padding: 30px;
`;

const LinkExitStyled = styled.div`
  background-color: ${Colors.button};
  padding: 10px;
  border-radius: 20px;
  width: 200px;
  text-align: center;
  &:hover {
    background-color: ${Colors.buttonHover};
  }
  color: rgb(255, 255, 255);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: rgb(76, 72, 82);
`;

const LinkStyled = styled(Link)`
  display: block;
  text-align: center;
  margin: 10px 0;
  text-decoration: none;
  color: rgb(76, 72, 82);
  border-bottom: 1px solid #ccc;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${Colors.buttonListHover};
  }
`;

export default App;
