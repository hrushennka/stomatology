import React, { useEffect, useState } from "react";
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
  Paper,
  TextField,
  CircularProgress,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import type { SelectChangeEvent } from "@mui/material";
import api from "../scripts/api";
import { Colors } from "../constants/Colors";

interface Visit {
  VisitID: number;
  VisitDate: string;
  VisitTime: string;
  DoctorName: string;
  PatientName: string;
}

const headerCellStyles = {
  fontWeight: 700,
  color: "white",
};

const VisitListPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [patientFilter, setPatientFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [newVisitDate, setNewVisitDate] = useState("");
  const [newVisitTime, setNewVisitTime] = useState("");
  const [newDoctorId, setNewDoctorId] = useState<number | "">("");
  const [newPatientId, setNewPatientId] = useState<number | "">("");
  const [doctors, setDoctors] = useState<{ doctorid: number; DoctorFullName: string }[]>([]);
  const [patients, setPatients] = useState<{ patientid: number; PatientFullName: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchVisits();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await api.get<Visit[]>("/appointment/list");
      setVisits(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Ошибка загрузки визитов");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/appointment/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Ошибка загрузки врачей", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get("/appointment/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Ошибка загрузки пациентов", err);
    }
  };

  const handleCreateVisit = async () => {
    if (!newDoctorId || !newPatientId || !newVisitDate || !newVisitTime) {
      setMessage("Заполните все поля");
      setMessageType("error");
      return;
    }
    try {
      const payload = {
        doctorId: newDoctorId,
        patientId: newPatientId,
        visitDate: newVisitDate,
        visitTime: newVisitTime,
      };
      const res = await api.post("/appointment/visits", payload);
      if ([200, 201].includes(res.status)) {
        fetchVisits();
        setOpenDialog(false);
        setNewDoctorId("");
        setNewPatientId("");
        setNewVisitDate("");
        setNewVisitTime("");
        setMessage("Запись успешно создана");
        setMessageType("success");
      }
    } catch (err) {
      console.error(err);
      setMessage("Не удалось создать запись");
      setMessageType("error");
    }
  };

  const filteredVisits = visits
    .filter((v) => v.DoctorName.toLowerCase().includes(doctorFilter.toLowerCase()))
    .filter((v) => v.PatientName.toLowerCase().includes(patientFilter.toLowerCase()))
    .sort((a, b) => {
      const t1 = new Date(a.VisitDate).getTime();
      const t2 = new Date(b.VisitDate).getTime();
      return sortDirection === "asc" ? t1 - t2 : t2 - t1;
    });

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Список визитов</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)} startIcon={<FaPlus />}>
          Создать запись
        </Button>
      </Box>

      <Snackbar
        open={!!message}
        autoHideDuration={5000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setMessage(null)} severity={messageType} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Фильтр по врачу"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        />
        <TextField
          label="Фильтр по пациенту"
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: Colors.tableHeader }}>
              <TableRow>
                <TableCell sx={headerCellStyles}>
                    <TableSortLabel
  active
  direction={sortDirection}
  onClick={toggleSortDirection}
  sx={{
    color: 'white !important',
    '& .MuiTableSortLabel-icon': {
      color: 'white !important',
    },
    '&.Mui-active': {
      color: 'white !important',
    },
    '&:hover': {
      color: 'white !important',
    },
  }}
>
  Дата
</TableSortLabel>
                    </TableCell>
                <TableCell sx={headerCellStyles}>Время</TableCell>
                <TableCell sx={headerCellStyles}>Врач</TableCell>
                <TableCell sx={headerCellStyles}>Пациент</TableCell>
              </TableRow>
            </TableHead>
<TableBody>
  {filteredVisits.map((v) => (
    <TableRow
      key={v.VisitID}
      sx={{
        "&:hover": {
          backgroundColor: Colors.tableRowHover,
        },
      }}
    >
      <TableCell>{new Date(v.VisitDate).toLocaleDateString()}</TableCell>
      <TableCell>{v.VisitTime}</TableCell>
      <TableCell>{v.DoctorName}</TableCell>
      <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{v.PatientName}</span>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FaPlus />}
          onClick={() => console.log(`Добавляем услуги для визита ${v.VisitID}`)}
          sx={{ ml: 2 }}
        >
          Добавить услуги
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Создать новую запись</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              type="date"
              label="Дата"
              value={newVisitDate}
              onChange={(e) => setNewVisitDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="time"
              label="Время"
              value={newVisitTime}
              onChange={(e) => setNewVisitTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="select-doctor-label">Врач</InputLabel>
              <Select
                labelId="select-doctor-label"
                value={newDoctorId === "" ? "" : String(newDoctorId)}
                label="Врач"
                onChange={(e) => setNewDoctorId(Number(e.target.value))}
              >
                {doctors.map((doc) => (
                  <MenuItem key={doc.doctorid} value={String(doc.doctorid)}>
                    {doc.DoctorFullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-patient-label">Пациент</InputLabel>
              <Select
                labelId="select-patient-label"
                value={newPatientId === "" ? "" : String(newPatientId)}
                label="Пациент"
                onChange={(e: SelectChangeEvent) => setNewPatientId(Number(e.target.value))}
              >
                {patients.map((pat) => (
                  <MenuItem key={pat.patientid} value={String(pat.patientid)}>
                    {pat.PatientFullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreateVisit}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VisitListPage;
