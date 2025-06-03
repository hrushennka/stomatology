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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddContractModal from "../components/ContractModal";
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
  clientName: string;
  status: boolean;
  type: "organization";
}

type Contract = PrivateContract | OrganizationContract;

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"organization" | "private">(
    "organization"
  );
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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
        newOffset === 0
          ? response.data.contracts
          : [...prev, ...response.data.contracts]
      );
      setTotalCount(response.data.totalCount);
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
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот контракт?"
    );
    if (confirmDelete) {
      console.log(contractId, type);
      try {
        await api.delete(`/contract/${type}/${contractId}`);
        setContracts(
          contracts.filter((contract) => contract.id !== contractId)
        );
      } catch (error) {
        console.error("Ошибка при удалении контракта:", error);
      }
    } else {
      console.log("Удаление договора отменено.");
    }
  };

  useEffect(() => {
    fetchContracts(activeTab, offset);
  }, [activeTab, offset]);

  if (loading) {
    return <CircularProgress />;
  }

  const updateContractInList = (updatedContract: any) => {
    console.log(updatedContract);

    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === updatedContract.id ? updatedContract : contract
      )
    );
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const loadMoreContracts = () => {
    setOffset((prev) => prev + limit);
    console.log(offset, totalCount);
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
        <Box>
          {/* <Button
            sx={{ mr: 2 }}
            variant="contained"
            onClick={() => {
              setModalOpen(true);
              setIsEditing(false);
            }}
          >
            Добавить контракт
          </Button> */}
          <Button variant="contained" onClick={handleBackButtonClick}>
            <FaArrowLeft /> Назад
          </Button>
        </Box>
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
                  <Typography variant="body2" sx={headerCellStyles}>
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
            {contracts.map((contract) => {
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
                  <TableCell>{contract.clientName}</TableCell>
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
                      sx={{ mr: 2 }}
                      onClick={() => {
                        setModalOpen(true);
                        setCurrentContract(contract);
                        setIsEditing(true);
                      }}
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

      <AddContractModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        isEditing={isEditing}
        initialData={currentContract}
        onUpdateContract={updateContractInList}
      />
      {(offset + limit <= totalCount || totalCount <= limit) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Button
            variant="outlined"
            onClick={loadMoreContracts}
            disabled={loading}
          >
            Загрузить еще
          </Button>
        </Box>
      )}
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
