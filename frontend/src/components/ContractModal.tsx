import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Switch,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import api from "../scripts/api";
interface AddContractModalProps {
  open: boolean;
  handleClose: () => void;
  isEditing: boolean;
  onUpdateContract?: (contract: any) => void;
  initialData?: {
    type: "organization" | "private";
    id: number;
    number: string;
    startDate?: string;
    endDate?: string;
    amount?: string;
    clientName?: string;
    status?: boolean;
  } | null;
}

const AddContractModal: React.FC<AddContractModalProps> = ({
  open,
  handleClose,
  isEditing,
  initialData,
  onUpdateContract,
}) => {
  const [isOrganization, setIsOrganization] = useState(true);
  const [contractData, setContractData] = useState({
    id: 0,
    number: "",
    startDate: "",
    endDate: "",
    amount: "",
    clientName: "",
    status: false,
  });

  const handleAddContract = async () => {};
  const handleEditContract = async (
    data: typeof contractData,
    isOrganization: boolean
  ) => {
    const confirmEdit = window.confirm(
      "Вы действительно хотите сохранить договор?"
    );

    if (confirmEdit) {
      try {
        const contractNew = {
          number: data.number,
          type: isOrganization,
          startDate: data.startDate,
          endDate: data.endDate,
          amount: data.amount,
          status: data.status,
        };
        const response = await api.put(`/contract/${data.id}`, contractNew);
        const type = isOrganization ? "organization" : "private";
        const updatedContract = {
          id: data.id,
          ...contractNew,
          type,
          clientName: data.clientName,
        };

        console.log(updatedContract);
        if (onUpdateContract) {
          onUpdateContract(updatedContract);
        }

        console.log("Контракт успешно обновлен:", response.data);
      } catch (error: any) {
        console.error(
          "Ошибка при редактировании контракта:",
          error.response?.data?.message || error.message
        );
      }
    }
  };

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        setIsOrganization(initialData.type === "organization");

        setContractData({
          id: initialData.id || 0,
          number: initialData.number || "",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          amount: initialData.amount || "",
          clientName: initialData.clientName || "",
          status: initialData.status || false,
        });
      } else {
        setIsOrganization(true);
      }
    }
  }, [open, isEditing, initialData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setContractData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!isEditing) {
      handleAddContract();
    } else {
      handleEditContract(contractData, isOrganization);
    }
    handleClose();
  };

  const handleStatusChange = (e: any) => {
    const newStatus = e.target.checked;
    setContractData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const renderFields = () => (
    <>
      {isOrganization ? (
        <>
          <TextField
            fullWidth
            variant="outlined"
            name="organizationName"
            label="Название организации"
            value={contractData.clientName}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            fullWidth
            variant="outlined"
            name="number"
            label="Номер"
            value={contractData.number}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            name="startDate"
            label="Дата начала"
            value={contractData.startDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            name="endDate"
            label="Дата завершения"
            value={contractData.endDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="number"
            name="amount"
            label="Сумма контракта"
            value={contractData.amount}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </>
      ) : (
        <>
          <TextField
            fullWidth
            variant="outlined"
            name="firstName"
            label="Имя клиента"
            value={contractData.clientName}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            fullWidth
            variant="outlined"
            name="number"
            label="Номер"
            value={contractData.number}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </>
      )}
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0)" },
      }}
    >
      <Box sx={{ ...style, width: 400 }}>
        <Typography variant="h6" component="h2" mb={2}>
          {isEditing ? "Редактировать контракт" : "Добавить контракт"}
        </Typography>

        {/* {!isEditing && (
          <FormControlLabel
            sx={{ pb: 3 }}
            control={
              <Switch
                checked={isOrganization}
                onChange={(e) => setIsOrganization(e.target.checked)}
              />
            }
            label={isOrganization ? "Для организации" : "Для частного клиента"}
          />
        )} */}

        {renderFields()}
        {isEditing && (
          <FormControlLabel
            sx={{ pb: 2 }}
            control={
              <Checkbox
                checked={contractData.status}
                onChange={handleStatusChange}
              />
            }
            label="Статус"
          />
        )}
        <form style={submitButton} onSubmit={handleSubmit}>
          <Button type="submit" variant="contained">
            {!isEditing ? "Добавить договор" : "Сохранить договор"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const submitButton = {
  display: "flex",
  justifyContent: "flex-end",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default AddContractModal;
