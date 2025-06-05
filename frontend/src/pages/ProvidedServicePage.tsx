import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Select, Card, Descriptions, Tag} from 'antd';
import type { SelectProps } from 'antd';
import api from "../scripts/api";
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import { Colors } from "../constants/Colors";

interface Doctor {
  id: number;
  fullName: string;
}

interface Patient {
  id: number;
  fullName: string;
}

interface Visit {
  visitid: number;
  visitdate: string;
  visittime: string;
  doctor: Doctor;
  patient: Patient;
  visitcomment?: string;
}

interface Service {
  serviceid: number;
  servicename: string;
  servicedescription: string;
  servicecost: string;
}

interface ProvidedService {
  providedserviceid: number;
  visitid: number;
  serviceid: number;
  tblservice: Service;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  return timeString.split(':').slice(0, 2).join(':');
};

const formatCurrency = (value: string) => {
  return parseFloat(value).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ₽';
};

const ProvidedServicePage: React.FC = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providedServices, setProvidedServices] = useState<ProvidedService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [loading, setLoading] = useState({
    visit: true,
    services: true,
    providedServices: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitResponse, servicesResponse, providedServicesResponse] = await Promise.all([
          api.get<Visit>(`/service/visits/${visitId}`),
          api.get<Service[]>('/service/services'),
          api.get<ProvidedService[]>(`/service/visitservices/${visitId}`)
        ]);

        setVisit(visitResponse.data);
        setServices(servicesResponse.data);
        setProvidedServices(providedServicesResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading({
          visit: false,
          services: false,
          providedServices: false
        });
      }
    };

    fetchData();
  }, [visitId]);

  const serviceOptions: SelectProps['options'] = services.map(service => ({
    label: `${service.servicename} - ${formatCurrency(service.servicecost)}`,
    value: service.serviceid,
  }));

  const handleAddService = async () => {
    if (!selectedServiceId || !visitId) return;

    try {
      const response = await api.post<ProvidedService>('/service/visits/services', {
        visitId,
        serviceId: selectedServiceId,
      });

      console.log('Response from add service:', response.data);

      setProvidedServices(prev => {
        const newService = {
          ...response.data,
          tblservice: services.find(s => s.serviceid === selectedServiceId)!
        };
        return [...prev, newService];
      });

      setIsModalOpen(false);
      setSelectedServiceId(null);
    } catch (error) {
      console.error('Ошибка добавления услуги:', error);
    }
  };

  const handleDeleteService = async (providedServiceId: number) => {
    try {
      await api.delete(`/service/visits/services/${providedServiceId}`);
      setProvidedServices(prev => prev.filter(ps => ps.providedserviceid !== providedServiceId));
    } catch (error) {
      console.error('Ошибка удаления услуги:', error);
    }
  };

  const columns = [
    {
      title: 'Название услуги',
      dataIndex: ['tblservice', 'servicename'],
      key: 'servicename',
    },
    {
      title: 'Описание',
      dataIndex: ['tblservice', 'servicedescription'],
      key: 'servicedescription',
    },
    {
      title: 'Стоимость',
      key: 'servicecost',
      render: (_: any, record: ProvidedService) => formatCurrency(record.tblservice.servicecost),
      sorter: (a: ProvidedService, b: ProvidedService) => 
        parseFloat(a.tblservice.servicecost) - parseFloat(b.tblservice.servicecost),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: ProvidedService) => (
        <Button danger onClick={() => handleDeleteService(record.providedserviceid)}>
          Удалить
        </Button>
      ),
    },
  ];

  const totalCost = providedServices.reduce(
    (sum, ps) => sum + parseFloat(ps.tblservice.servicecost),
    0
  );

  const navigate = useNavigate();

  if (loading.visit || loading.services || loading.providedServices) {
    return <div>Загрузка...</div>;
  }

  if (!visit) {
    return <div>Запись не найдена</div>;
  }

  return (
    <div style={{ padding: '24px', margin: '10px 60px'}}>
      <Button
        style={{ margin: '10px 0px'}}
        size="large"
        onClick={() => navigate('/appointments')}>
        Назад
      </Button>
      {/* <Card title="Информация о записи" style={{ marginBottom: '24px' }}>
        <Descriptions bordered>
          <Descriptions.Item label="Пациент">{visit.patient.fullName}</Descriptions.Item>
          <Descriptions.Item label="Врач">{visit.doctor.fullName}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions bordered>
          <Descriptions.Item label="Дата">{formatDate(visit.visitdate)}</Descriptions.Item>
          <Descriptions.Item label="Время">{formatTime(visit.visittime)}</Descriptions.Item>
          <Descriptions.Item label="Комментарий">
            {visit.visitcomment || '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card> */}

      <Card title="Информация о записи" style={{ marginBottom: '24px' }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Пациент">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{visit.patient.fullName}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Врач">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{visit.doctor.fullName}</span>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Дата и время">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Tag color='blue' style={{ fontSize: 16, fontWeight: 400, padding: 10 }}>{formatDate(visit.visitdate)}</Tag>
              <Tag color='green' style={{ fontSize: 16, fontWeight: 400, padding: 10  }}>{formatTime(visit.visittime)}</Tag>
            </div>
          </Descriptions.Item>
          
          <Descriptions.Item label="Комментарий">
            {visit.visitcomment ? (
              <div style={{ 
                padding: 8,
                backgroundColor: '#fafafa',
                borderRadius: 4,
                fontSize: 15
              }}>
                {visit.visitcomment}
              </div>
            ) : (
              <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Нет комментария</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Оказанные услуги"
        extra={
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Добавить услугу
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={providedServices}
          rowKey="providedserviceid"
          pagination={false}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <FileTextOutlined style={{ fontSize: '32px', color: '#bfbfbf', marginBottom: 16 }} />
                <div style={{ color: '#8c8c8c', fontSize: 16 }}>Нет услуг</div>
              </div>
            )
          }}
          footer={() => (
            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
              Итого: {formatCurrency(totalCost.toString())}
            </div>
          )}
        />
      </Card>

      <Modal
        title="Добавить услугу"
        open={isModalOpen}
        onOk={handleAddService}
        okText="Сохранить"
        cancelText="Отменить" 
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedServiceId(null);
        }}
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 16 
          }}>
            <Button 
              key="submit"
              type="primary"
              onClick={handleAddService}
              disabled={!selectedServiceId}
              style={{ minWidth: 120 }}
            >
              Добавить
            </Button>
            <Button 
              key="back" 
              onClick={() => setIsModalOpen(false)}
              style={{ minWidth: 120 }}
            >
              Отменить
            </Button>
          </div>
        }
        okButtonProps={{ disabled: !selectedServiceId }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Выберите услугу"
          options={serviceOptions}
          onChange={(value: number) => setSelectedServiceId(value)}
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) => 
            (option?.label?.toString() || '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Modal>
    </div>
  );
};

export default ProvidedServicePage;
