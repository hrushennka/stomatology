import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../constants/Colors";
import api from "../scripts/api";
import { FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
interface PrivateContract {
  id: number;
  number: string;
  clientName: string;
  type: "private";
}
interface OrganizationContract {
  id: number;
  number: string;
  startDate: string;
  endDate: string;
  amount: string;
  organizationName: string;
  type: "organization";
}
interface PrivateContract {
  id: number;
  number: string;
  clientName: string;
  type: "private";
}
interface OrganizationContract {
  id: number;
  number: string;
  startDate: string;
  endDate: string;
  amount: string;
  organizationName: string;
  type: "organization";
}
type Contract = PrivateContract | OrganizationContract;
const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await api.get("/contract");
        setContracts(response.data);
      } catch (error) {
        console.error("Ошибка при получении контрактов:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);
  if (loading) {
    return <div>Загрузка...</div>;
  }

  const handleBackButtonClick = () => {
    navigate(-1); // Возвращение на предыдущую страницу
  };
  return (
    <Container>
      <HeaderContainer>
        <Title>Список договоров</Title>
        <ButtonGroup>
          <BackButton onClick={handleBackButtonClick}>
            <FaArrowLeft /> Назад
          </BackButton>
          <AddButton disabled>Добавить договор</AddButton>
        </ButtonGroup>
      </HeaderContainer>
      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Номер договора</TableHeader>
              <TableHeader>ФИО/Организация</TableHeader>
              <TableHeader>Дата завершения</TableHeader>
              <TableHeader>Статус</TableHeader>
              <TableHeader>Тип договора</TableHeader>
              <TableHeader>Остаток баланса</TableHeader>
              <TableHeader>Действия</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.number}</TableCell>
                <TableCell>
                  {contract.type === "organization"
                    ? contract.organizationName
                    : contract.clientName}
                </TableCell>
                <TableCell>
                  {contract.type === "organization" ? contract.endDate : ""}
                </TableCell>
                <TableCell>Активен</TableCell>
                <TableCell>
                  {contract.type === "organization" ? "оранизация" : "частный"}
                </TableCell>
                <TableCell>
                  {contract.type === "organization"
                    ? `${contract.amount} ₽`
                    : ""}
                </TableCell>
                <TableCell>
                  <ActionIcons>
                    <EditIcon>
                      <FaEdit />
                    </EditIcon>
                    <DeleteIcon>
                      <FaTrash />
                    </DeleteIcon>
                  </ActionIcons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
`;
const AddButton = styled.button`
  background-color: ${Colors.button};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: ${Colors.buttonHover};
  }
`;

const TableContainer = styled.div`
  max-width: 1000px;
  overflow-x: auto;
  box-shadow: 2px -4px 20px 10px hsl(0deg 0% 89.91%);
`;
const Table = styled.table`
  max-width: 1000px;
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;
const TableRow = styled.tr`
  &:hover {
    background-color: rgb(252, 252, 238);
  }
`;
const TableHeader = styled.th`
  background-color: ${Colors.main};
  color: ${Colors.button};
  padding: 10px;
  height: 40px;
  border-bottom: solid 1px rgb(216, 216, 216);
  font-size: 15px;
  text-align: center;
`;
const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  &.centered-cell {
    text-align: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: ${Colors.button};
  border: 2px solid ${Colors.button};
  border-radius: 60px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${Colors.buttonHover};
    background-color: rgb(230, 229, 229);
    border-color: ${Colors.buttonHover};
  }
`;
const ActionIcons = styled.div`
  display: flex;
  gap: 10px;
  svg {
    font-size: 1.2em;
  }
`;
const EditIcon = styled.div`
  cursor: pointer;
  color: ${Colors.buttonEdit};

  &:hover {
    color: ${Colors.buttonEditHover};
  }
`;
const DeleteIcon = styled.div`
  cursor: pointer;
  color: ${Colors.buttonEdit};
  &:hover {
    color: ${Colors.buttonEditHover}};
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;
const Title = styled.h1`
  margin-bottom: 20px;
  color: rgb(76, 72, 82);
`;
export default ContractsPage;
