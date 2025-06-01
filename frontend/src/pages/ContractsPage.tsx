import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Colors } from "../constants/Colors";
import { FaTrash, FaEdit, FaArrowLeft, FaCircle } from "react-icons/fa";
import api from "../scripts/api";
import SearchField from "../components/SearchField";

interface PrivateContract {
  id: number;
  number: string;
  clientName: string;
  status: boolean;
  type: "private";
}

interface OrganizationContract {
  id: number;
  number: string;
  startDate: string;
  endDate: string;
  amount: string;
  organizationName: string;
  status: boolean;
  type: "organization";
}

type Contract = PrivateContract | OrganizationContract;

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"organization" | "private">(
    "organization"
  );
  const [offset, setOffset] = useState(0);
  const [limit] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const fetchContracts = async (
    type: "organization" | "private",
    newOffset = 0
  ) => {
    try {
      setLoading(true);
      const response = await api.get(`/contract/${type}`, {
        params: {
          limit,
          offset: newOffset,
          search: searchTerm,
        },
      });

      setContracts((prev) =>
        newOffset === 0 ? response.data : [...prev, ...response.data]
      );
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка при получении контрактов:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContract = async (
    type: "organization" | "private",
    contractId: number
  ) => {
    console.log(contractId, type);
    try {
      await api.delete(`/contract/${type}/${contractId}`);
      setContracts(contracts.filter((contract) => contract.id !== contractId));
    } catch (error) {
      console.error("Ошибка при удалении контракта:", error);
    }
  };

  useEffect(() => {
    fetchContracts(activeTab, offset);
  }, [activeTab, offset]);

  if (loading) {
    return <CircularProgress />;
  }

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const organizationContracts = contracts.filter(
    (c) => c.type === "organization"
  );
  const privateContracts = contracts.filter((c) => c.type === "private");

  const loadMoreContracts = () => {
    setOffset((prev) => prev + limit);
  };

  const handleSearch = () => {
    setSearchTerm("");
    setOffset(0);
    fetchContracts(activeTab, 0);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const isExpired = (endDate: string) => {
    const currentDate = new Date();
    const expirationDate = new Date(endDate);
    return expirationDate < currentDate;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Список договоров</Typography>

        <Button variant="contained" onClick={handleBackButtonClick}>
          <FaArrowLeft /> Назад
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_e, newValue) => {
          setActiveTab(newValue);
          setOffset(0);
          fetchContracts(newValue, 0);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label={`Организации`} value="organization" />
        <Tab label={`Частные клиенты`} value="private" />
      </Tabs>

      <TableContainer>
        <Table>
          <TableHead
            sx={{
              backgroundColor: Colors.tableHeader,
            }}
          >
            <TableRow>
              <TableCell sx={headerCellStyles}>Номер договора</TableCell>
              <TableCell sx={headerCellStyles}>
                <Box display="flex" alignItems="center">
                  {" "}
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    ФИО/Организация
                  </Typography>
                  <SearchField
                    showSearch={showSearch}
                    setShowSearch={setShowSearch}
                    setSearchTerm={setSearchTerm}
                    handleKeyDown={handleKeyDown}
                  />
                </Box>
              </TableCell>
              <TableCell sx={headerCellStyles}>Статус</TableCell>
              {activeTab === "organization" && (
                <TableCell sx={headerCellStyles}>Дата завершения</TableCell>
              )}
              {activeTab === "organization" && (
                <TableCell sx={headerCellStyles}>Остаток баланса</TableCell>
              )}
              <TableCell sx={headerCellStyles}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(activeTab === "organization"
              ? organizationContracts
              : privateContracts
            ).map((contract) => {
              const expired =
                contract.type === "organization" && isExpired(contract.endDate);
              const hasZeroBalance =
                contract.type === "organization" &&
                Number(contract.amount) === 0;
              return (
                <TableRow
                  key={contract.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: Colors.tableRowHover,
                    },
                    borderLeft: expired
                      ? "4px solid rgb(240, 70, 47)"
                      : hasZeroBalance
                      ? "4px solid rgb(240, 70, 47)"
                      : "none",
                  }}
                >
                  <TableCell>{contract.number}</TableCell>
                  <TableCell>
                    {contract.type === "organization"
                      ? contract.organizationName
                      : contract.clientName}
                  </TableCell>
                  <TableCell>
                    {contract.status ? "Активен" : "Не активен"}
                  </TableCell>

                  {contract.type === "organization" && (
                    <>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {expired && <FaCircle style={circleStyles} />}
                          {contract.endDate}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {hasZeroBalance && <FaCircle style={circleStyles} />}
                          {`${contract.amount} ₽`}
                        </Box>
                      </TableCell>
                    </>
                  )}

                  <TableCell>
                    <Button
                      onClick={() => console.log("Edit contract", contract.id)}
                    >
                      <FaEdit
                        style={{ fontSize: "18px", marginRight: "8px" }}
                      />
                    </Button>
                    <Button
                      onClick={() =>
                        deleteContract(
                          contract.type === "organization"
                            ? "organization"
                            : "private",
                          contract.id
                        )
                      }
                    >
                      <FaTrash
                        style={{ fontSize: "18px", marginRight: "8px" }}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Button
          variant="outlined"
          onClick={loadMoreContracts}
          disabled={loading}
        >
          Загрузить еще
        </Button>
      </Box>
    </Box>
  );
};

const circleStyles = {
  color: "rgb(240, 70, 47)",
  fontSize: "10px",
  marginRight: "8px",
};

const headerCellStyles = {
  fontWeight: 700,
  color: "White",
};
export default ContractsPage;
