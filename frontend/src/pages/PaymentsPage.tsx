import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../scripts/api";

interface ProvidedService {
  tblservice: {
    servicename: string;
    servicecost: string;
  };
}

interface Visit {
  VisitID: number;
  PatientName: string;
  VisitDate: string;
  VisitTime: string;
  TotalAmount: string;
  ContractType: string;
  OrgContractAmount: number | null;
  OrgContractID: number | null;
  OrganizationID: number | null;
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
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [expandedVisitId, setExpandedVisitId] = useState<number | null>(null);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await api.get<Visit[]>("/payment/list");
      
      const visitsWithServices = response.data.map(visit => ({
        ...visit,
        Services: visit.tblprovidedservices?.map((ps: ProvidedService) => ({
          servicename: ps.tblservice.servicename,
          servicecost: parseFloat(ps.tblservice.servicecost)
        }))
      }));
      
      setVisits(visitsWithServices);
      setMessage(null);
    } catch (error: any) {
      console.error("Error fetching visits:", error);
      setMessage(error.response?.data?.error || "Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  const handlePayVisit = async (visitId: number) => {
    setProcessingPayment(visitId);
    try {
      const response = await api.post<ApiResponse>(`/payment/pay/${visitId}`);
      setMessage(response.data.message);
      
      setVisits(prevVisits => 
        prevVisits.map(visit => 
          visit.VisitID === visitId ? { ...visit, IsPaid: true } : visit
        )
      );
      
      setTimeout(fetchVisits, 1000);
    } catch (error: any) {
      console.error("Error paying visit:", error);
      setMessage(error.response?.data?.error || "Ошибка при оплате");
    } finally {
      setProcessingPayment(null);
    }
  };

  const toggleVisitDetails = (visitId: number) => {
    setExpandedVisitId(expandedVisitId === visitId ? null : visitId);
  };

  if (loading) {
    return <Container>Загрузка данных...</Container>;
  }

  return (
    <Container>
      <Title>Список визитов для оплаты</Title>
      
      {message && (
        <MessageBox type={message.includes("успеш") ? "success" : "error"}>
          {message}
          <CloseButton onClick={() => setMessage(null)}>×</CloseButton>
        </MessageBox>
      )}

      <VisitsList>
        {visits.length === 0 ? (
          <EmptyMessage>Нет визитов для отображения</EmptyMessage>
        ) : (
          visits.map((visit) => (
            <VisitCard key={visit.VisitID}>
              <VisitHeader onClick={() => toggleVisitDetails(visit.VisitID)}>
                <PatientName>{visit.PatientName}</PatientName>
                <VisitInfo>
                  <VisitDateTime>
                    {new Date(visit.VisitDate).toLocaleDateString()} {visit.VisitTime}
                  </VisitDateTime>
                  {visit.IsPaid && <PaidBadge>Оплачено</PaidBadge>}
                  <ExpandIcon>
                    {expandedVisitId === visit.VisitID ? '▲' : '▼'}
                  </ExpandIcon>
                </VisitInfo>
              </VisitHeader>

              {expandedVisitId === visit.VisitID && (
                <ServicesList>
                  <ServicesTitle>Оказанные услуги:</ServicesTitle>
                  {visit.Services?.map((service, index) => (
                    <ServiceItem key={index}>
                      <ServiceName>{service.servicename}</ServiceName>
                      <ServicePrice>{service.servicecost.toFixed(2)} руб.</ServicePrice>
                    </ServiceItem>
                  ))}
                  <TotalRow>
                    <TotalLabel>Итого:</TotalLabel>
                    <TotalAmount>{visit.TotalAmount} руб.</TotalAmount>
                  </TotalRow>
                </ServicesList>
              )}

              <VisitDetails>
                <DetailRow>
                  <DetailLabel>Сумма:</DetailLabel>
                  <DetailValue>{visit.TotalAmount} руб.</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Тип договора:</DetailLabel>
                  <DetailValue>{visit.ContractType}</DetailValue>
                </DetailRow>
                {visit.ContractType === 'организация' && visit.OrgContractAmount !== null && (
                  <DetailRow>
                    <DetailLabel>Сумма по договору:</DetailLabel>
                    <DetailValue>{visit.OrgContractAmount} руб.</DetailValue>
                  </DetailRow>
                )}
              </VisitDetails>

              <PayButton 
                onClick={() => handlePayVisit(visit.VisitID)}
                disabled={visit.IsPaid || processingPayment === visit.VisitID}
                isPaid={visit.IsPaid}
                isLoading={processingPayment === visit.VisitID}
              >
                {processingPayment === visit.VisitID ? (
                  <LoadingText>Обработка...</LoadingText>
                ) : visit.IsPaid ? (
                  "Оплачено"
                ) : (
                  "Оплатить"
                )}
              </PayButton>
            </VisitCard>
          ))
        )}
      </VisitsList>
    </Container>
  );
};

// Добавляем новые стили для деталей услуг
const ServicesList = styled.div`
  margin: 12px 0;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
`;

const ServicesTitle = styled.h3`
  font-size: 1rem;
  color: #555;
  margin-bottom: 8px;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
`;

const ServiceName = styled.span`
  color: #333;
`;

const ServicePrice = styled.span`
  font-weight: 500;
  color: #333;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
  font-weight: 600;
`;

const TotalLabel = styled.span`
  color: #333;
`;

const TotalAmount = styled.span`
  color: #2e7d32;
`;

const ExpandIcon = styled.span`
  margin-left: 8px;
  font-size: 0.9rem;
`;

// Остальные стили остаются без изменений
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
`;

const VisitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
`;

const VisitCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const VisitHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
`;

const PatientName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
`;

const VisitInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VisitDateTime = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PaidBadge = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const VisitDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #555;
`;

const DetailValue = styled.span`
  color: #333;
`;

const PayButton = styled.button<{ isPaid: boolean; isLoading: boolean }>`
  background: ${({ isPaid, isLoading }) => 
    isPaid ? '#e0e0e0' : isLoading ? '#81c784' : '#4caf50'};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  cursor: ${({ isPaid }) => isPaid ? 'not-allowed' : 'pointer'};
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ isPaid, isLoading }) => 
      isPaid ? '#e0e0e0' : isLoading ? '#81c784' : '#3e8e41'};
    transform: ${({ isPaid }) => isPaid ? 'none' : 'translateY(-1px)'};
  }

  &:active {
    transform: ${({ isPaid }) => isPaid ? 'none' : 'translateY(0)'};
  }
`;

const LoadingText = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::after {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MessageBox = styled.div<{ type: 'success' | 'error' }>`
  position: relative;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 6px;
  background: ${({ type }) => type === 'success' ? '#e8f5e9' : '#ffebee'};
  color: ${({ type }) => type === 'success' ? '#2e7d32' : '#c62828'};
  border: 1px solid ${({ type }) => type === 'success' ? '#c8e6c9' : '#ffcdd2'};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
  grid-column: 1 / -1;
`;

export default PaymentsPage;