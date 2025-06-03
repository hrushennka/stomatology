import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { createGlobalStyle, styled } from "styled-components";
import {
  Container,
  Button,
  Typography,
  Box,
  List,
  ListItem,
} from "@mui/material";
import { Colors } from "./constants/Colors";
import ProvidedServicePage from "./pages/ProvidedServicePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ContractsPage from "./pages/ContractsPage";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif; 
    background-color: rgba(247, 248, 252, 0.49);
  }
`;

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/services/:visitId" element={<ProvidedServicePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
      </Routes>
    </Router>
  );
};

const MainPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Главная страница
      </Typography>

      <Box
        sx={{
          border: "1px solid rgba(189, 189, 189, 0.5)",
          borderRadius: 2,
          padding: 3,
          backgroundColor: "white",
          boxShadow: 1,
        }}
      >
        <List sx={{ padding: 0 }}>
          <ListItem>
            <LinkStyled to="/services/1/">Список оказанных услуг</LinkStyled>
          </ListItem>
          <ListItem>
            <LinkStyled to="/appointments">Список записей</LinkStyled>
          </ListItem>
          <ListItem>
            <LinkStyled to="/payments">Список оплат</LinkStyled>
          </ListItem>
          <ListItem>
            <LinkStyled to="/contracts">Список договоров</LinkStyled>
          </ListItem>
        </List>

        <Box mt={2}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button variant="contained">Выйти из системы</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

const LinkStyled = styled(Link)`
  display: block;
  text-align: center;
  margin: 10px 0;
  text-decoration: none;
  color: rgba(88, 93, 100, 0.93);
  border-bottom: 1px solid rgba(189, 189, 189, 0.5);
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
  &:hover {
    color: #1976d2;
    background-color: rgba(33, 150, 243, 0.1);
  }
`;
export default App;
