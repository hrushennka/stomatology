import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Collapse,
  IconButton,
  Alert,
  Snackbar,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Colors } from "../constants/Colors";
import { FaArrowLeft, FaChevronDown, FaChevronUp } from "react-icons/fa";
import api from "../scripts/api";

interface ProvidedService {
  tblservice: {
    servicename: string;
    servicecost: string;
  };
}

interface Visit {
  // paidFromContract?: number;
  // paidByClient?: number;
  VisitID: number;
  PatientName: string;
  VisitDate: string;
  VisitTime: string;
  TotalAmount: string;
  ContractType: string;
  OrgContractAmount: number | null;
  OrgContractID: number | null;
  OrganizationID: number | null;
  OrganizationName: string | null; 
  IsPaid: boolean;
  tblpatient: {
    patientfirstname: string;
    patientlastname: string;
    patientpatronymic?: string;
    patientid: number;
  };
  tblprovidedservices?: ProvidedService[];
  payments?: any[];
  Services?: {
    servicename: string;
    servicecost: number;
  }[];
}

interface ApiResponse {
  message: string;
  paidAmount?: number;
  isPaid?: boolean;
}

const PaymentsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [expandedVisitId, setExpandedVisitId] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [activeTab, setActiveTab] = useState<"paid" | "unpaid">("unpaid");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisits();
  }, [offset]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await api.get<Visit[]>("/payment/list", {
        params: { limit, offset },
      });

      const visitsWithServices = response.data.map(visit => ({
        ...visit,
        Services: visit.tblprovidedservices?.map((ps: ProvidedService) => ({
          servicename: ps.tblservice.servicename,
          servicecost: parseFloat(ps.tblservice.servicecost),
        })),
        OrganizationName: visit.OrganizationName || null
      }));

      setVisits(prev =>
        offset === 0 ? visitsWithServices : [...prev, ...visitsWithServices]
      );
    } catch (error: any) {
      console.error("Error fetching visits:", error);
      setMessage(error.response?.data?.error || "Ошибка при загрузке данных");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayVisit = async (visitId: number) => {
    setProcessingPayment(visitId);
    try {
      const response = await api.post<ApiResponse>(`/payment/pay/${visitId}`);
      setMessage(response.data.message);
      setMessageType("success");

      setVisits(prevVisits =>
        prevVisits.map(visit =>
          visit.VisitID === visitId
            ? {
                ...visit,
                IsPaid: true,
              }
            : visit
        )
      );

      setTimeout(() => {
        setOffset(0);
        fetchVisits();
      }, 1000);
    } catch (error: any) {
      console.error("Error paying visit:", error);
      setMessage(error.response?.data?.error || "Ошибка при оплате");
      setMessageType("error");
    } finally {
      setProcessingPayment(null);
    }
  };

  const toggleVisitDetails = (visitId: number) => {
    setExpandedVisitId(expandedVisitId === visitId ? null : visitId);
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const filteredVisits = visits.filter(v =>
    activeTab === "paid" ? v.IsPaid : !v.IsPaid
  );

  if (loading && visits.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Список визитов для оплаты</Typography>
        <Button variant="contained" onClick={handleBackButtonClick}>
          <FaArrowLeft style={{ marginRight: 8 }} /> Назад
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => {
          setActiveTab(newValue);
          setOffset(0);
        }}
        sx={{ mb: 2 }}
      >
        <Tab label="Неоплаченные" value="unpaid" />
        <Tab label="Оплаченные" value="paid" />
      </Tabs>

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMessage(null)} severity={messageType} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: Colors.tableHeader }}>
            <TableRow>
              <TableCell sx={headerCellStyles}>Пациент</TableCell>
              <TableCell sx={headerCellStyles}>Дата и время</TableCell>
              <TableCell sx={headerCellStyles}>Тип договора</TableCell>
              <TableCell sx={headerCellStyles}>Сумма</TableCell>
              <TableCell sx={headerCellStyles}>Действия</TableCell>
              <TableCell sx={headerCellStyles} width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="textSecondary" sx={{ py: 4 }}>
                    Нет визитов для отображения
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
                <React.Fragment key={visit.VisitID}>
                  <TableRow
                    sx={{
                      "&:hover": { backgroundColor: Colors.tableRowHover },
                      borderLeft: visit.IsPaid ? "4px solid #4caf50" : "4px solid rgb(240, 70, 47)",
                    }}
                  >
                    <TableCell>{visit.PatientName}</TableCell>
                    <TableCell>
                      {new Date(visit.VisitDate).toLocaleDateString()} {visit.VisitTime.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      {visit.ContractType === "организация" ? (
                        <>
                          организация<br />
                          <Typography variant="body2">
                            {visit.OrganizationName || "—"}
                          </Typography>
                        </>
                      ) : (
                        visit.ContractType
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600} color={visit.IsPaid ? "success.main" : "text.primary"}>
                        {visit.TotalAmount} ₽
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handlePayVisit(visit.VisitID)}
                        disabled={visit.IsPaid || processingPayment === visit.VisitID}
                        sx={{ minWidth: 100 }}
                      >
                        {processingPayment === visit.VisitID ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : visit.IsPaid ? (
                          "Оплачено"
                        ) : (
                          "Оплатить"
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleVisitDetails(visit.VisitID)}
                      >
                        {expandedVisitId === visit.VisitID ? <FaChevronUp /> : <FaChevronDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedVisitId === visit.VisitID} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Оказанные услуги
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Услуга</TableCell>
                                <TableCell align="right">Стоимость</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {visit.Services?.map((service, index) => (
                                <TableRow key={index}>
                                  <TableCell>{service.servicename}</TableCell>
                                  <TableCell align="right">{service.servicecost.toFixed(2)} ₽</TableCell>
                                </TableRow>
                              ))}
                             <TableRow>
                                <TableCell colSpan={1} sx={{ fontWeight: 600 }}>
                                  Итого:
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontWeight: 600,
                                    color: visit.IsPaid ? "success.main" : "error.main",
                                  }}
                                >
                                  {visit.TotalAmount} ₽
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const headerCellStyles = {
  fontWeight: 700,
  color: "white",
};

export default PaymentsPage;
