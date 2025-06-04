import {
  ProvidedServiceModel,
  ServiceModel,
  VisitModel,
  DoctorModel,
  PatientModel
} from "../config/models.js";

export const getVisitDetails = async (req, res) => {
  try {
    const { visitId } = req.params;
    const visit = await VisitModel.findByPk(visitId, {
      include: [
        {
          model: DoctorModel,
          as: 'tbldoctor',
          attributes: ['doctorid', 'doctorfirstname', 'doctorlastname', 'doctorpatronymic']
        },
        {
          model: PatientModel,
          as: 'tblpatient',
          attributes: ['patientid', 'patientfirstname', 'patientlastname', 'patientpatronymic']
        }
      ]
    });
    
    const response = {
      visitid: visitId,
      visitdate: visit.visitdate,
      visittime: visit.visittime,
      visitcomment: visit.visitcomment,
      doctor: {
        id: visit.tbldoctor.doctorid,
        fullName: `${visit.tbldoctor.doctorlastname} ${visit.tbldoctor.doctorfirstname} ${visit.tbldoctor.doctorpatronymic || ''}`.trim()
      },
      patient: {
        id: visit.tblpatient.patientid,
        fullName: `${visit.tblpatient.patientlastname} ${visit.tblpatient.patientfirstname} ${visit.tblpatient.patientpatronymic || ''}`.trim()
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера при получении информации о визите" });
  }
};

export const getAllServices = async (req, res) => {
    try {
        const services = await ServiceModel.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getServicesByVisit = async (req, res) => {
    try {
        const { visitId } = req.params;
        const providedServices = await ProvidedServiceModel.findAll({
            where: { visitid: visitId },
            include: [ServiceModel]
        });
        res.json(providedServices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addServiceToVisit = async (req, res) => {
    try {
        const { visitId, serviceId } = req.body;
        
        const newProvidedService = await ProvidedServiceModel.create({
            visitid: visitId,
            serviceid: serviceId
        });
        
        res.status(201).json(newProvidedService);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeServiceFromVisit = async (req, res) => {
    try {
        const { providedServiceId } = req.params;
        const deleted = await ProvidedServiceModel.destroy({
            where: { providedserviceid: providedServiceId }
        });
        
        if (deleted) {
            return res.json({ message: "Услуга удалена из визита" });
        }
        
        res.status(404).json({ message: "Связь услуги с визитом не найдена" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
