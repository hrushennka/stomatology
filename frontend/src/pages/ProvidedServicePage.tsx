// import React, { useState } from "react";
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Colors } from "../constants/Colors";
import api from "../scripts/api";
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Select, Card, Descriptions } from 'antd';
import type { SelectProps } from 'antd';


interface Visit {
  visitid: number;
  visitdate: string;
  visittime: string;
  doctorid: number;
  patientid: number;
  visitcomment?: string;
}

interface Service {
  serviceid: number;
  servicename: string;
  servicedescription: string;
  servicecost: number;
}

interface ProvidedService {
  providedserviceid: number;
  service: Service;
}

// const ProvidedServicePage = () => {};
// export default ProvidedServicePage;

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

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {

        const visitResponse = await api.get(`/service/visits/${visitId}`);
        console.log('Visit data:', visitResponse.data);
        setVisit(visitResponse.data);
        setLoading(prev => ({ ...prev, visit: false }));

        const servicesResponse = await api.get('/service/services');
        console.log('Visit data:', servicesResponse.data);
        setServices(servicesResponse.data);
        setLoading(prev => ({ ...prev, services: false }));


        const providedServicesResponse = await api.get(`/service/visitservices/${visitId}`);
        console.log('Visit data:', providedServicesResponse.data);
        setProvidedServices(providedServicesResponse.data);
        setLoading(prev => ({ ...prev, providedServices: false }));

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
  }, [visitId]);

  const serviceOptions: SelectProps['options'] = services.map(service => ({
    label: `${service.servicename} - ${service.servicecost} руб.`,
    value: service.serviceid,
  }));

  const handleAddService = async () => {
    if (!selectedServiceId) return;

    try {
      const response = await api.post('/service/visits/services', {
        visitId,
        serviceId: selectedServiceId,
      });


      setProvidedServices(prev => [...prev, response.data]);
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
      dataIndex: ['service', 'servicename'],
      key: 'servicename',
    },
    {
      title: 'Описание',
      dataIndex: ['service', 'servicedescription'],
      key: 'servicedescription',
    },
    {
      title: 'Стоимость',
      dataIndex: ['service', 'servicecost'],
      key: 'servicecost',
      render: (cost: number) => `${cost} руб.`,
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
    (sum, ps) => sum + ps.service.servicecost,
    0
  );

  if (loading.visit || loading.services || loading.providedServices) {
    return <div>Загрузка...</div>;
  }

  if (!visit) {
    return <div>Запись не найдена</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Информация о записи" style={{ marginBottom: '24px' }}>
        <Descriptions bordered>
          <Descriptions.Item label="Дата">{visit.visitdate}</Descriptions.Item>
          <Descriptions.Item label="Время">{visit.visittime}</Descriptions.Item>
          <Descriptions.Item label="Комментарий">
            {visit.visitcomment || '—'}
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
          footer={() => (
            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
              Итого: {totalCost} руб.
            </div>
          )}
        />
      </Card>

      <Modal
        title="Добавить услугу"
        open={isModalOpen}
        onOk={handleAddService}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedServiceId(null);
        }}
        okButtonProps={{ disabled: !selectedServiceId }}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Выберите услугу"
          options={serviceOptions}
          onChange={(value: number) => setSelectedServiceId(value)}
          showSearch
          optionFilterProp="label"
        //   filterOption={(input, option) =>
        //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            filterOption={(input, option) => 
                (option?.label?.toString() || '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Modal>
    </div>
  );
};

export default ProvidedServicePage;